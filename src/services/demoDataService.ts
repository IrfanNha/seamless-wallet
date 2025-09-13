import { MempoolTransaction } from '@/types';

// Demo data for when the real API is not available or returns empty results
export const getDemoMempoolTransactions = (): MempoolTransaction[] => {
  return [
    {
      txid: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      fee: 15000,
      weight: 400,
      status: {
        confirmed: false,
      },
      vin: [
        {
          txid: "f1e2d3c4b5a6978012345678901234567890abcdef1234567890abcdef123456",
          vout: 0,
          prevout: {
            scriptpubkey: "76a914abcdef1234567890abcdef1234567890abcdef1288ac",
            scriptpubkey_asm: "OP_DUP OP_HASH160 abcdef1234567890abcdef1234567890abcdef12 OP_EQUALVERIFY OP_CHECKSIG",
            scriptpubkey_type: "p2pkh",
            scriptpubkey_address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            value: 100000000,
          },
        },
      ],
      vout: [
        {
          scriptpubkey: "76a9141234567890abcdef1234567890abcdef1234567888ac",
          scriptpubkey_asm: "OP_DUP OP_HASH160 1234567890abcdef1234567890abcdef12345678 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
          value: 99985000,
        },
      ],
    },
    {
      txid: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      fee: 25000,
      weight: 600,
      status: {
        confirmed: false,
      },
      vin: [
        {
          txid: "e1d2c3b4a5978012345678901234567890abcdef1234567890abcdef12345678",
          vout: 1,
          prevout: {
            scriptpubkey: "76a914fedcba0987654321fedcba0987654321fedcba0988ac",
            scriptpubkey_asm: "OP_DUP OP_HASH160 fedcba0987654321fedcba0987654321fedcba09 OP_EQUALVERIFY OP_CHECKSIG",
            scriptpubkey_type: "p2pkh",
            scriptpubkey_address: "1CvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
            value: 200000000,
          },
        },
      ],
      vout: [
        {
          scriptpubkey: "76a914234567890abcdef1234567890abcdef12345678988ac",
          scriptpubkey_asm: "OP_DUP OP_HASH160 234567890abcdef1234567890abcdef123456789 OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "1DvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
          value: 199975000,
        },
      ],
    },
    {
      txid: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890",
      fee: 30000,
      weight: 800,
      status: {
        confirmed: false,
      },
      vin: [
        {
          txid: "d1c2b3a4978012345678901234567890abcdef1234567890abcdef1234567890",
          vout: 0,
          prevout: {
            scriptpubkey: "76a9140123456789abcdef0123456789abcdef0123456788ac",
            scriptpubkey_asm: "OP_DUP OP_HASH160 0123456789abcdef0123456789abcdef01234567 OP_EQUALVERIFY OP_CHECKSIG",
            scriptpubkey_type: "p2pkh",
            scriptpubkey_address: "1EvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
            value: 500000000,
          },
        },
      ],
      vout: [
        {
          scriptpubkey: "76a91434567890abcdef1234567890abcdef123456789a88ac",
          scriptpubkey_asm: "OP_DUP OP_HASH160 34567890abcdef1234567890abcdef123456789a OP_EQUALVERIFY OP_CHECKSIG",
          scriptpubkey_type: "p2pkh",
          scriptpubkey_address: "1FvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
          value: 499970000,
        },
      ],
    },
  ];
};

export const getDemoRecommendedFees = () => {
  return {
    fastestFee: 50,
    halfHourFee: 25,
    hourFee: 15,
    economyFee: 5,
    minimumFee: 1,
  };
};

export const getDemoMempoolStats = () => {
  return {
    mempoolSize: 15,
    currentBlockHeight: 820000,
    averageFee: 20,
  };
};
