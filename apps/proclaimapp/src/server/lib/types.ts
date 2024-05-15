export type ScoutAddress = {
  block_number_balance_updated_at: number;
  coin_balance: string;
  creation_tx_hash: string;
  creator_address_hash: string;
  ens_domain_name: null | string;
  exchange_rate: null | string;
  has_beacon_chain_withdrawals: boolean;
  has_custom_methods_read: boolean;
  has_custom_methods_write: boolean;
  has_decompiled_code: boolean;
  has_logs: boolean;
  has_methods_read: boolean;
  has_methods_read_proxy: boolean;
  has_methods_write: boolean;
  has_methods_write_proxy: boolean;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: boolean;
  hash: string;
  implementation_address: null | string;
  implementation_name: null | string;
  is_contract: boolean;
  is_verified: boolean;
  name: string;
  private_tags: string[];
  public_tags: string[];
  token: {
    address: string;
    circulating_market_cap: null | string;
    decimals: string;
    exchange_rate: null | string;
    holders: string;
    icon_url: null | string;
    name: string;
    symbol: string;
    total_supply: string;
    type: string;
    volume_24h: null | string;
  };
  watchlist_address_id: null | string;
  watchlist_names: string[];
};

export type ScoutTokenTransfer = {
  block_hash: string;
  from: {
    ens_domain_name: null | string;
    hash: string;
    implementation_name: null | string;
    is_contract: boolean;
    is_verified: null | boolean;
    name: null | string;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  log_index: string;
  method: string;
  timestamp: string;
  to: {
    ens_domain_name: null | string;
    hash: string;
    implementation_name: null | string;
    is_contract: boolean;
    is_verified: null | boolean;
    name: null | string;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  token: {
    address: string;
    circulating_market_cap: null | string;
    decimals: string;
    exchange_rate: null | string;
    holders: string;
    icon_url: null | string;
    name: string;
    symbol: string;
    total_supply: string;
    type: string;
    volume_24h: null | string;
  };
  total: {
    decimals: string;
    value: string;
  };
  tx_hash: string;
  type: string;
};

export type ScoutTokenBalance = {
  token: {
    address: string;
    circulating_market_cap: number | null;
    decimals: string;
    exchange_rate: number | null;
    holders: string;
    icon_url: string | null;
    name: string;
    symbol: string;
    total_supply: string;
    type: string;
    volume_24h: number | null;
  };
  token_id: string | null;
  token_instance: string | null;
  value: string;
};

