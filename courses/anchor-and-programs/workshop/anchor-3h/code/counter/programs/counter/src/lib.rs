use anchor_lang::prelude::*;

declare_id!("841TgnQsPTuTihCn22RaBCTgpnAiG4QL3oQLkyrw3L6N");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize_pda(ctx: Context<InitializePda>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.count = 0;
        Ok(())
    }

    pub fn update_pda(ctx: Context<UpdatePda>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.count = state.count.checked_add(1).unwrap();
        Ok(())
    }
}

#[account]
pub struct Counter {
    pub count: u64,
}

#[account]
pub struct State {
    pub count: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct InitializePda<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 8,
        seeds = [b"state", payer.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePda<'info> {
    #[account(
        mut,
        seeds = [b"state", payer.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,
    pub payer: Signer<'info>,
}
