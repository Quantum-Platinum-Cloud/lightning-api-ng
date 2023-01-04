import path from 'path';
import { Method } from './method';

/**
 * This class represents the object that is used to render the markdown
 * for the code samples for each method. Using this class reduces the
 * amount of logic needed in the template files
 */
export default class CodeSamples {
  method: Method;

  constructor(method: Method) {
    this.method = method;
  }

  get daemonName() {
    return this.method.service.package.daemon.name;
  }

  get packageName() {
    return this.method.service.package.name;
  }

  get serviceName() {
    return this.method.service.name;
  }

  get methodName() {
    return this.method.name;
  }

  get loaderFiles() {
    if (this.method.service.package.daemon.name === 'lnd') {
      return this.protoFileName === 'lightning.proto'
        ? `'lightning.proto'`
        : `['lightning.proto', '${this.protoFileName}']`;
    } else {
      return `'${this.protoFileName}'`;
    }
  }

  get macaroonPath() {
    return this.daemonName === 'lnd'
      ? `LND_DIR/data/chain/bitcoin/regtest/admin.macaroon`
      : `${this.daemonName.toUpperCase()}_DIR/regtest/${
          this.daemonName
        }.macaroon`;
  }

  get requiresMacaroon() {
    const anonServices = ['lnrpc.WalletUnlocker', 'lnrpc.State'];
    return !anonServices.includes(`${this.packageName}.${this.serviceName}`);
  }

  get grpcPort() {
    return this.method.service.package.daemon.grpcPort;
  }

  get restPort() {
    return this.method.service.package.daemon.restPort;
  }

  get requestName() {
    return this.method.request.name;
  }

  get requestFields() {
    return this.method.request.fields;
  }

  get responseFields() {
    return this.method.response.fields;
  }

  get isUnary() {
    return this.method.streamingDirection === '';
  }

  get isServerStreaming() {
    return this.method.streamingDirection === 'server';
  }

  get isClientStreaming() {
    return this.method.streamingDirection === 'client';
  }

  get isBidirectionalStreaming() {
    return this.method.streamingDirection === 'bidirectional';
  }

  get isStreaming() {
    return !this.isUnary;
  }

  get isRestPost() {
    return this.method.restMethod === 'POST';
  }

  get protoFileName() {
    return this.method.service.fileName;
  }

  get stubFileName() {
    return path.basename(this.protoFileName, '.proto');
  }

  get pythonRestArgs() {
    const args: string[] = [];
    if (this.requiresMacaroon) args.push('headers=headers, ');
    if (this.method.responseStreaming) args.push('stream=True, ');
    if (this.isRestPost) args.push('data=json.dumps(data), ');
    return args.join('');
  }
}