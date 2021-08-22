import {BindingScope} from '@loopback/core';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {VaccinationApp} from '../..';
import {Memorydb} from '../fixtures/datasources/memorydb.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new VaccinationApp({
    rest: restConfig,
  });

  /**
   * Overriding loopback boot options so that it doesn't look for datasource in src/dataSources folder
   * and uses the one which we explicitly provide for testing.
   *
   */
  app.bootOptions = {
    ...app.bootOptions,
    /**
     * Setting up new in-memory dataSource to make the test run faster.
     */
    ...{
      datasources: {
        dirs: ['__tests__/fixtures/datasources'],
        extensions: ['.datasource.ts'],
        nested: true,
      },
    },
  };

  /**
   * Binding applied in-memory DB as same as actual DB Binding name for the purpose of mocking.
   */
  app
    .bind('datasources.vaccination_db')
    .toClass(Memorydb)
    .inScope(BindingScope.SINGLETON);

  /**
   * Getting singleton db instance created by loopback while booting, for manual manipulation of DB for tests.
   */
  const db: Memorydb = await app.get('datasources.vaccination_db');

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client, db};
}

export interface AppWithClient {
  app: VaccinationApp;
  client: Client;
  db: Memorydb;
}
