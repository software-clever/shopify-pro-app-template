import { ClientBase, Pool, QueryResult } from "pg";
import FileContentReader from "app/infrastructure/FileContentReader";

type PgQueryable = Pool | ClientBase;

export interface QueryExecutorInterface {
  queryByName(name: string, values?: any[]): Promise<QueryResult>;
}

export class QueryExecutor {
  constructor(
    private readonly dbClient: PgQueryable,
    private readonly fileContentReader: FileContentReader,
  ) {}
  public async queryByName(name: string, values?: any[]): Promise<QueryResult> {
    const text = await this.fileContentReader.read(name);
    if (!text || text.length === 0) {
      return {
        oid: 0,
        command: "",
        rowCount: 0,
        rows: [],
        fields: [],
      } as QueryResult;
    }
    return this.dbClient.query({
      name,
      text,
      values,
    });
  }
}

export class PoolWrap implements QueryExecutorInterface {
  private readonly queryExecutor: QueryExecutor;
  constructor(private readonly pool: Pool) {
    this.queryExecutor = new QueryExecutor(this.pool, new FileContentReader());
  }
  public async queryByName(name: string, values?: any[]): Promise<QueryResult> {
    return this.queryExecutor.queryByName(name, values);
  }
}
