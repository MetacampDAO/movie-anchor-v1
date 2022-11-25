pub mod processor;
pub mod movie_instruction;
pub mod error;
pub mod state;

use anchor_lang::prelude::*;
use processor::*;

declare_id!("FjRUbADjAQP3G7wBUdUzGCxVCGwcFhJnsonjpn3MDMMZ");

#[program]
pub mod movie_anchor {
    use super::*;

    pub fn add_or_update_review(
        ctx: Context<AddOrUpdateReview>,
        variant: u8,
        title: String,
        rating: u8,
        description: String,
    ) -> Result<()> {
        process_instruction(ctx, variant, title, rating, description)
    }
}