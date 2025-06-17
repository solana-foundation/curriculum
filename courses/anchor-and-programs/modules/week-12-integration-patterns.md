# Week 12: Integration Patterns with Off-Chain Systems

## Learning Objectives

- Design robust oracle integration patterns for external data feeds
- Implement efficient batch operations and transaction optimization
- Build real-time event monitoring and webhook systems
- Create reliable off-chain worker processes and job queues
- Master API integration patterns and data synchronization strategies

## Topics Covered

- Oracle integration: Pyth, Switchboard, and custom oracle solutions
- Batch processing patterns and transaction parallelization
- Real-time event monitoring with WebSocket connections
- Off-chain worker architecture and job processing systems
- API integration patterns and rate limiting strategies
- Data synchronization between on-chain and off-chain systems
- Caching strategies and performance optimization

## Hands-on Exercises

1. **Oracle Integration System**: Build a price feed aggregator using multiple oracles
2. **Batch Processing Engine**: Implement efficient batch transaction processing
3. **Event Monitoring Service**: Create real-time blockchain event monitoring
4. **Worker Queue System**: Build scalable off-chain job processing
5. **API Gateway**: Implement comprehensive API integration layer

## Homework

- Build a complete price oracle system with multiple data sources
- Document integration patterns and performance benchmarks

## Oracle Integration Patterns

### Price Feed Integration

```rust
use pyth_solana_receiver_sdk::price_update::{PriceUpdateV2, VerificationLevel};
use switchboard_solana::AggregatorAccountData;

#[account]
pub struct PriceOracle {
    pub symbol: String,
    pub pyth_price_feed: Pubkey,
    pub switchboard_feed: Pubkey,
    pub last_update: i64,
    pub price: u64,
    pub confidence: u64,
    pub source: PriceSource,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PriceSource {
    Pyth,
    Switchboard,
    Aggregated,
}

#[derive(Accounts)]
pub struct UpdatePrice<'info> {
    #[account(mut)]
    pub price_oracle: Account<'info, PriceOracle>,
    /// CHECK: Pyth price account
    pub pyth_price_account: AccountInfo<'info>,
    /// CHECK: Switchboard aggregator account
    pub switchboard_account: AccountInfo<'info>,
    pub authority: Signer<'info>,
}

pub fn update_price_feed(ctx: Context<UpdatePrice>) -> Result<()> {
    let oracle = &mut ctx.accounts.price_oracle;

    // Get Pyth price
    let pyth_price = get_pyth_price(&ctx.accounts.pyth_price_account)?;

    // Get Switchboard price
    let switchboard_price = get_switchboard_price(&ctx.accounts.switchboard_account)?;

    // Aggregate prices with confidence weighting
    let aggregated_price = aggregate_prices(pyth_price, switchboard_price)?;

    // Update oracle state
    oracle.price = aggregated_price.price;
    oracle.confidence = aggregated_price.confidence;
    oracle.last_update = Clock::get()?.unix_timestamp;
    oracle.source = PriceSource::Aggregated;

    // Emit price update event
    emit!(PriceUpdated {
        symbol: oracle.symbol.clone(),
        price: oracle.price,
        confidence: oracle.confidence,
        timestamp: oracle.last_update,
    });

    Ok(())
}

fn get_pyth_price(price_account: &AccountInfo) -> Result<PriceData> {
    let price_update = PriceUpdateV2::try_deserialize(&mut price_account.data.borrow().as_ref())?;

    require!(
        price_update.verification_level == VerificationLevel::Full,
        ErrorCode::InvalidPriceData
    );

    Ok(PriceData {
        price: price_update.price as u64,
        confidence: price_update.conf as u64,
        timestamp: price_update.publish_time,
    })
}

fn get_switchboard_price(aggregator_account: &AccountInfo) -> Result<PriceData> {
    let aggregator = AggregatorAccountData::new(aggregator_account)?;
    let round_result = aggregator.get_result()?;

    Ok(PriceData {
        price: round_result.mantissa as u64,
        confidence: (round_result.mantissa as f64 * 0.01) as u64, // 1% confidence
        timestamp: aggregator.latest_confirmed_round.round_open_timestamp,
    })
}
```

### Custom Oracle Implementation

```rust
#[account]
pub struct CustomOracle {
    pub data_sources: Vec<DataSource>,
    pub aggregation_method: AggregationMethod,
    pub update_threshold: u64, // Minimum price change to trigger update
    pub max_staleness: i64,    // Maximum age of price data
    pub required_signatures: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DataSource {
    pub source_id: String,
    pub authority: Pubkey,
    pub weight: u32,
    pub last_update: i64,
    pub active: bool,
}

#[derive(Accounts)]
pub struct SubmitOracleData<'info> {
    #[account(mut)]
    pub oracle: Account<'info, CustomOracle>,
    #[account(mut)]
    pub price_data: Account<'info, PriceSubmission>,
    pub data_provider: Signer<'info>,
}

pub fn submit_oracle_data(
    ctx: Context<SubmitOracleData>,
    price: u64,
    signature: [u8; 64]
) -> Result<()> {
    let oracle = &ctx.accounts.oracle;
    let submission = &mut ctx.accounts.price_data;

    // Verify data provider authority
    let source = oracle.data_sources
        .iter()
        .find(|s| s.authority == ctx.accounts.data_provider.key())
        .ok_or(ErrorCode::UnauthorizedDataProvider)?;

    require!(source.active, ErrorCode::InactiveDataSource);

    // Verify signature
    verify_price_signature(price, &signature, &source.authority)?;

    // Store price submission
    submission.submissions.push(PriceSubmissionData {
        source_id: source.source_id.clone(),
        price,
        timestamp: Clock::get()?.unix_timestamp,
        signature,
    });

    // Check if we have enough submissions to update price
    if submission.submissions.len() >= oracle.required_signatures as usize {
        update_aggregated_price(oracle, submission)?;
    }

    Ok(())
}
```

## Batch Processing and Parallelization

### Transaction Batching Framework

```javascript
class TransactionBatcher {
  constructor(connection, wallet, options = {}) {
    this.connection = connection;
    this.wallet = wallet;
    this.batchSize = options.batchSize || 10;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async processBatch(instructions, signers = []) {
    const batches = this.createBatches(instructions);
    const results = [];

    for (const batch of batches) {
      try {
        const result = await this.executeBatch(batch, signers);
        results.push(result);
      } catch (error) {
        console.error("Batch execution failed:", error);

        // Retry failed batch with smaller size
        const retryResults = await this.retryBatch(batch, signers);
        results.push(...retryResults);
      }
    }

    return results;
  }

  createBatches(instructions) {
    const batches = [];
    for (let i = 0; i < instructions.length; i += this.batchSize) {
      batches.push(instructions.slice(i, i + this.batchSize));
    }
    return batches;
  }

  async executeBatch(instructions, signers) {
    const transaction = new Transaction();

    // Add compute budget instruction for large batches
    if (instructions.length > 5) {
      const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000,
      });
      transaction.add(computeBudgetIx);
    }

    // Add all instructions to transaction
    instructions.forEach((ix) => transaction.add(ix));

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.wallet, ...signers],
      {
        commitment: "confirmed",
        maxRetries: this.retryAttempts,
      }
    );

    return { signature, instructionCount: instructions.length };
  }

  async retryBatch(failedBatch, signers) {
    // Reduce batch size and retry individual instructions
    const results = [];

    for (const instruction of failedBatch) {
      try {
        const result = await this.executeBatch([instruction], signers);
        results.push(result);
      } catch (error) {
        console.error("Individual instruction failed:", error);
        results.push({ error: error.message, instruction });
      }
    }

    return results;
  }
}
```

### Parallel Transaction Processing

```javascript
class ParallelProcessor {
  constructor(connection, maxConcurrency = 5) {
    this.connection = connection;
    this.maxConcurrency = maxConcurrency;
    this.semaphore = new Semaphore(maxConcurrency);
  }

  async processParallel(operations) {
    const promises = operations.map((op) =>
      this.semaphore.acquire().then(async (release) => {
        try {
          return await this.processOperation(op);
        } finally {
          release();
        }
      })
    );

    return await Promise.allSettled(promises);
  }

  async processOperation(operation) {
    const { instructions, signers, metadata } = operation;

    // Create transaction with lookup tables for efficiency
    const message = new TransactionMessage({
      payerKey: this.wallet.publicKey,
      recentBlockhash: await this.getRecentBlockhash(),
      instructions,
    }).compileToV0Message(this.addressLookupTables);

    const transaction = new VersionedTransaction(message);
    transaction.sign([this.wallet, ...signers]);

    const signature = await this.connection.sendTransaction(transaction, {
      maxRetries: 3,
      skipPreflight: false,
    });

    // Wait for confirmation
    await this.connection.confirmTransaction(signature, "confirmed");

    return {
      signature,
      metadata,
      timestamp: Date.now(),
    };
  }
}
```

## Real-Time Event Monitoring

### WebSocket Event Listener

```javascript
class SolanaEventMonitor {
  constructor(connection, programId) {
    this.connection = connection;
    this.programId = programId;
    this.subscriptions = new Map();
    this.eventHandlers = new Map();
  }

  async startMonitoring() {
    // Monitor program account changes
    const programSubscription = this.connection.onProgramAccountChange(
      this.programId,
      (accountInfo, context) => {
        this.handleAccountChange(accountInfo, context);
      },
      "confirmed"
    );

    this.subscriptions.set("program", programSubscription);

    // Monitor logs for events
    const logSubscription = this.connection.onLogs(
      this.programId,
      (logs, context) => {
        this.handleProgramLogs(logs, context);
      },
      "confirmed"
    );

    this.subscriptions.set("logs", logSubscription);
  }

  handleAccountChange(accountInfo, context) {
    try {
      // Decode account data based on discriminator
      const discriminator = accountInfo.accountInfo.data.slice(0, 8);
      const accountType = this.getAccountType(discriminator);

      if (accountType) {
        const decodedData = this.decodeAccountData(
          accountInfo.accountInfo.data,
          accountType
        );

        this.emitEvent("accountChanged", {
          account: accountInfo.accountId,
          type: accountType,
          data: decodedData,
          slot: context.slot,
        });
      }
    } catch (error) {
      console.error("Error handling account change:", error);
    }
  }

  handleProgramLogs(logs, context) {
    for (const log of logs.logs) {
      // Parse Anchor events from logs
      if (log.startsWith("Program data: ")) {
        try {
          const eventData = this.parseAnchorEvent(log);
          if (eventData) {
            this.emitEvent("programEvent", {
              event: eventData,
              signature: logs.signature,
              slot: context.slot,
            });
          }
        } catch (error) {
          console.error("Error parsing event:", error);
        }
      }
    }
  }

  parseAnchorEvent(logLine) {
    // Extract base64 encoded event data
    const dataStr = logLine.replace("Program data: ", "");
    const eventData = Buffer.from(dataStr, "base64");

    // Parse event discriminator and data
    const discriminator = eventData.slice(0, 8);
    const eventName = this.getEventName(discriminator);

    if (eventName) {
      const data = this.program.coder.events.decode(eventName, eventData);
      return { name: eventName, data };
    }

    return null;
  }

  onEvent(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  emitEvent(eventType, data) {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }
}
```

### Event Processing Pipeline

```javascript
class EventProcessor {
  constructor(monitor, options = {}) {
    this.monitor = monitor;
    this.buffer = [];
    this.batchSize = options.batchSize || 50;
    this.flushInterval = options.flushInterval || 5000;
    this.processors = new Map();

    this.setupEventHandlers();
    this.startBatchProcessor();
  }

  setupEventHandlers() {
    this.monitor.onEvent("accountChanged", (event) => {
      this.buffer.push({
        type: "account_change",
        ...event,
        timestamp: Date.now(),
      });
    });

    this.monitor.onEvent("programEvent", (event) => {
      this.buffer.push({
        type: "program_event",
        ...event,
        timestamp: Date.now(),
      });
    });
  }

  startBatchProcessor() {
    setInterval(() => {
      if (this.buffer.length > 0) {
        this.processBatch();
      }
    }, this.flushInterval);
  }

  async processBatch() {
    const batch = this.buffer.splice(0, this.batchSize);

    try {
      // Process events in parallel
      const promises = batch.map((event) => this.processEvent(event));
      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Error processing event batch:", error);
    }
  }

  async processEvent(event) {
    const processor = this.processors.get(event.type);
    if (processor) {
      await processor(event);
    }

    // Store event in database
    await this.storeEvent(event);

    // Send webhook notifications
    await this.sendWebhooks(event);
  }

  registerProcessor(eventType, processor) {
    this.processors.set(eventType, processor);
  }

  async storeEvent(event) {
    // Store in database (Redis, PostgreSQL, etc.)
    await this.database.events.create(event);
  }

  async sendWebhooks(event) {
    const webhooks = await this.getWebhooksForEvent(event.type);

    const promises = webhooks.map((webhook) =>
      this.sendWebhook(webhook.url, event, webhook.secret)
    );

    await Promise.allSettled(promises);
  }
}
```

## Off-Chain Worker Architecture

### Job Queue System

```javascript
const Queue = require("bull");
const Redis = require("ioredis");

class SolanaWorkerQueue {
  constructor(redisConfig) {
    this.redis = new Redis(redisConfig);
    this.queues = new Map();
    this.setupQueues();
  }

  setupQueues() {
    // High priority queue for time-sensitive operations
    this.queues.set(
      "high",
      new Queue("solana-high-priority", {
        redis: this.redis,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: "exponential",
        },
      })
    );

    // Normal priority queue for regular operations
    this.queues.set(
      "normal",
      new Queue("solana-normal", {
        redis: this.redis,
        defaultJobOptions: {
          removeOnComplete: 50,
          removeOnFail: 25,
          attempts: 5,
          backoff: "exponential",
        },
      })
    );

    // Low priority queue for batch operations
    this.queues.set(
      "low",
      new Queue("solana-low-priority", {
        redis: this.redis,
        defaultJobOptions: {
          removeOnComplete: 25,
          removeOnFail: 10,
          attempts: 10,
          backoff: "exponential",
        },
      })
    );

    this.setupProcessors();
  }

  setupProcessors() {
    // Process high priority jobs
    this.queues.get("high").process("transaction", 10, async (job) => {
      return await this.processTransaction(job.data);
    });

    // Process account updates
    this.queues.get("normal").process("account-update", 5, async (job) => {
      return await this.processAccountUpdate(job.data);
    });

    // Process batch operations
    this.queues.get("low").process("batch-operation", 2, async (job) => {
      return await this.processBatchOperation(job.data);
    });
  }

  async addJob(queueName, jobType, data, options = {}) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    return await queue.add(jobType, data, {
      priority: options.priority || 0,
      delay: options.delay || 0,
      ...options,
    });
  }

  async processTransaction(data) {
    const { instructions, signers, metadata } = data;

    try {
      // Build and send transaction
      const transaction = new Transaction();
      instructions.forEach((ix) => transaction.add(ix));

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        signers,
        { commitment: "confirmed" }
      );

      return {
        success: true,
        signature,
        metadata,
      };
    } catch (error) {
      console.error("Transaction processing failed:", error);
      throw error;
    }
  }

  async processAccountUpdate(data) {
    const { accountAddress, expectedData } = data;

    try {
      // Fetch current account state
      const accountInfo = await this.connection.getAccountInfo(accountAddress);

      // Update local cache/database
      await this.updateAccountCache(accountAddress, accountInfo);

      // Trigger dependent processes
      await this.triggerDependentProcesses(accountAddress, accountInfo);

      return { success: true, account: accountAddress };
    } catch (error) {
      console.error("Account update processing failed:", error);
      throw error;
    }
  }
}
```

### API Integration and Rate Limiting

```javascript
class APIGateway {
  constructor(options = {}) {
    this.rateLimiter = new Map();
    this.cache = new LRU({ max: 1000, ttl: 60000 }); // 1 minute TTL
    this.retryConfig = {
      attempts: 3,
      delay: 1000,
      backoff: 2,
    };
  }

  async makeRequest(endpoint, options = {}) {
    const cacheKey = this.getCacheKey(endpoint, options);

    // Check cache first
    if (this.cache.has(cacheKey) && !options.skipCache) {
      return this.cache.get(cacheKey);
    }

    // Check rate limits
    await this.checkRateLimit(endpoint);

    // Make request with retry logic
    const response = await this.requestWithRetry(endpoint, options);

    // Cache successful responses
    if (response.success && !options.skipCache) {
      this.cache.set(cacheKey, response);
    }

    return response;
  }

  async checkRateLimit(endpoint) {
    const key = this.getRateLimitKey(endpoint);
    const limit = this.rateLimiter.get(key) || {
      count: 0,
      resetTime: Date.now() + 60000,
    };

    // Reset counter if time window has passed
    if (Date.now() > limit.resetTime) {
      limit.count = 0;
      limit.resetTime = Date.now() + 60000;
    }

    // Check if rate limit exceeded
    if (limit.count >= 100) {
      // 100 requests per minute
      const waitTime = limit.resetTime - Date.now();
      throw new Error(`Rate limit exceeded. Try again in ${waitTime}ms`);
    }

    // Increment counter
    limit.count++;
    this.rateLimiter.set(key, limit);
  }

  async requestWithRetry(endpoint, options) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryConfig.attempts; attempt++) {
      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        lastError = error;

        if (attempt < this.retryConfig.attempts) {
          const delay =
            this.retryConfig.delay *
            Math.pow(this.retryConfig.backoff, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    return { success: false, error: lastError.message };
  }
}
```

## Resources

- [Pyth Network Integration](https://docs.pyth.network/)
- [Switchboard Oracle Docs](https://docs.switchboard.xyz/)
