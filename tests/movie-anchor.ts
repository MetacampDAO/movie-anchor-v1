import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MovieAnchor } from "../target/types/movie_anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("movie-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace.MovieAnchor as Program<MovieAnchor>;
  const user = anchor.web3.Keypair.generate();
  let reviewAccount: PublicKey;
  let movieTitle: string;

  it("Airdrops to user for payer", async () => {
    const airdropSellerSig = await provider.connection.requestAirdrop(
      user.publicKey,
      2e9
    );
    const latestSellerBlockhash =
      await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestSellerBlockhash.blockhash,
      lastValidBlockHeight: latestSellerBlockhash.lastValidBlockHeight,
      signature: airdropSellerSig,
    });
  });

  it("Adds movie review", async () => {
    movieTitle = "Titanic";
    let variant = 0; // 0 for add movie
    let rating = 5; // out of a total 5
    let description = "Fantastic! Best movie I've watched hands down!";
    [reviewAccount] = await PublicKey.findProgramAddress(
      [
        user.publicKey.toBytes(),
        Buffer.from(anchor.utils.bytes.utf8.encode(movieTitle)),
      ],
      program.programId
    );

    await program.methods
      .addOrUpdateReview(variant, movieTitle, rating, description)
      .accounts({
        initializer: user.publicKey,
        pdaAccount: reviewAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const storedReviewAccount = await program.account.movieAccountState.fetch(
      reviewAccount
    );

    console.log(
      "storedReviewAccount.description:",
      storedReviewAccount.description
    );
    console.log("storedReviewAccount.rating:", storedReviewAccount.rating);
    console.log("storedReviewAccount.title:", storedReviewAccount.title);
    assert.equal(storedReviewAccount.description, description);
    assert.ok(storedReviewAccount.rating == rating);
    assert.equal(storedReviewAccount.title, movieTitle);
  });

  it("Updates movie review", async () => {
    let variant = 1; // 0 for add movie
    let rating = 3; // out of a total 5
    let description =
      "I changed my mind, its an average movie after watching others!";

    await program.methods
      .addOrUpdateReview(variant, movieTitle, rating, description)
      .accounts({
        initializer: user.publicKey,
        pdaAccount: reviewAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const storedReviewAccount = await program.account.movieAccountState.fetch(
      reviewAccount
    );

    console.log(
      "storedReviewAccount.description:",
      storedReviewAccount.description
    );
    console.log("storedReviewAccount.rating:", storedReviewAccount.rating);
    console.log("storedReviewAccount.title:", storedReviewAccount.title);
    assert.equal(storedReviewAccount.description, description);
    assert.ok(storedReviewAccount.rating == rating);
    assert.equal(storedReviewAccount.title, movieTitle);
  });
});
