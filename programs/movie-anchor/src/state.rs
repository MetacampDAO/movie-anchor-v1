use anchor_lang::{prelude::*, solana_program};
use solana_program::{
    program_pack::{IsInitialized},
};

#[account]
pub struct MovieAccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub title: String,
    pub description: String
}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}