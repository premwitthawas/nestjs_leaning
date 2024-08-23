export const connection: Connection = {
  CONNECTION_STING: 'CONNECTION_STING',
  DB: 'MYSQL',
  DBNAME: 'DBNAME',
};
export type Connection = {
  CONNECTION_STING: string;
  DB: 'MYSQL' | 'POSTGRESQL' | 'MONGODB' | 'MSSQL';
  DBNAME: string;
};
