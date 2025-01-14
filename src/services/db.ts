import Container, { Service, Inject } from 'typedi';
import config from '@/config';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ILog } from '@/interfaces/ILog';

@Service()
export default class DbService {
  constructor(
    @Inject('pgk') private pgk: NamespaceKnex.KnexTypes,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createTokenTable() {
    try {
      const table = await this.pgk.schema.createTable('Token', table => {
        table.string('addr', 42).primary().unique();
        table.smallint('decimals').unsigned();
        table.string('name').index('idx_name');
        table.string('symbol', 32).index('idx_symbol');
        table.timestamp('createDate');
        table.timestamps(true, true, true);
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createPairTable() {
    try {
      const table = await this.pgk.schema.createTable('Pair', table => {
        table.string('addr', 42).notNullable().primary().unique();
        table.string('tokenAddr', 42).notNullable().index('idx_tokenAddr');
        table.string('lpAddr', 42).notNullable().index('idx_lpAddr');
        table.string('factoryAddr', 42).index('idx_factoryAddr');
        table.date('createDate');
        table.timestamps(true, true, true);
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createSwapTable() {
    try {
      const table = await this.pgk.schema.createTable('Swap', table => {
        table.primary(['blockNumber', 'logIdx']);
        table.bigint('blockNumber').notNullable().index('idx_swap_blockNumber');
        table.string('txHash', 80).notNullable().index('idx_swap_txHash');
        table.bigint('logIdx').notNullable().index('idx_swap_logIdx');
        table.string('pairAddr', 42).notNullable().index('idx_swap_pairAddr');
        table.string('tokenAddr', 42).notNullable().index('idx_swap_tokenAddr');
        table.string('lpAddr', 42).notNullable().index('idx_swap_lpAddr');
        table.decimal('gasPrice', 24, 12).notNullable();
        table.decimal('gasLimit', 24, 12).notNullable();
        table.string('txFrom', 42).index('idx_swap_txFrom');
        table.string('txTo', 42).index('idx_swap_txTo');
        table.string('swapSender', 42).notNullable().index('idx_swap_swapSender');
        table.string('swapTo', 42).notNullable().index('idx_swap_swapTo');
        table.string('side', 4).notNullable().index('idx_swap_side');
        table.decimal('lpReserveUsd', 84, 56).notNullable();
        table.decimal('tokenInUsd', 84, 56).notNullable();
        table.decimal('tokenOutUsd', 84, 56).notNullable();
        table.decimal('lpInUsd', 84, 56).notNullable();
        table.decimal('lpOutUsd', 84, 56).notNullable();
        table.decimal('tokenPriceUsd', 84, 56).notNullable();
        table.decimal('lpPriceUsd', 84, 56).notNullable();
        table.bigint('timestamp').notNullable();
        table.timestamps(true, true, true);
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createLogTable() {
    try {
      const table = await this.pgk.schema.createTable('Log', table => {
        table.integer('blockNumber').index('log_blockNumber');
        table.string('blockHash', 42);
        table.smallint('transactionIndex');
        table.boolean('removed');
        table.string('address', 42);
        table.text('data');
        table.string('topic0');
        table.string('topic1');
        table.string('topic2');
        table.string('topic3');
        table.string('transactionHash', 42);
        table.smallint('logIndex');

        table.index(['blockNumber', 'logIndex'], 'log_blockNumber_logIndex');
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createLogTopicsTable() {
    try {
      const table = await this.pgk.schema.createTable('Log', table => {
        table.integer('blockNumber').index('log_blockNumber');
        table.string('blockHash', 42);
        table.smallint('transactionIndex');
        table.boolean('removed');
        table.string('address', 42);
        table.text('data');
        table.json('topics');
        table.string('transactionHash', 42);
        table.smallint('logIndex');

        table.index(['blockNumber', 'logIndex'], 'log_blockNumber_logIndex');
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createBlockTable() {
    try {
      const table = await this.pgk.schema.createTable('Block', table => {
        table.string('hash', 42);
        table.string('parentHash', 42);
        table.integer('number').primary().unique();
        table.integer('timestamp');
        table.string('nonce', 42);
        table.smallint('difficulty');
        table.string('gasLimit', 18);
        table.string('gasUsed', 18);
        table.string('miner', 42);
        table.text('extraData');
        table.string('_difficulty', 42);
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async createTransactionTable() {
    try {
      const table = await this.pgk.schema.createTable('Transaction', table => {
        table.string('hash', 42).primary().unique();
        table.integer('blockNumber').index('idx_blockNumber');
      });

      return table;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async dropTable(tableName: string) {
    try {
      const droppedTable = await this.pgk.schema.dropTableIfExists(tableName);
      return droppedTable;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async dropAllTables(params) {
    // this.pgk.schema.dropTableIfExists('Contract');
  }

  public async createAllTables(params) {
    // this.createContractTable();
  }
}
