import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import moment from 'moment';
export class MySequence extends MiddlewareSequence {
  log(msg: string) {
    console.info(msg);
  }

  async handle(context: RequestContext) {
    this.log(
      `\n ${moment().utc().format()} [HTTP-IN] ${context.request.originalUrl}`,
    );
    await super.handle(context);
    this.log(
      `\n ${moment().utc().format()} [HTTP-OUT] ${context.request.originalUrl}`,
    );
  }
}
