import { ethers } from 'ethers';
import * as eth from './eth';
import { netId } from './helpers';
import { address, abi } from './constants';

/**
 * Submit a vote on a Compound Governance proposal.
 *
 * @param {string} proposalId The ID of the proposal to vote on. This is an
 *     auto-incrementing integer in the Governor Alpha contract.
 *
 * @returns {object} Returns an Ethers.js transaction object of the vote
 *     transaction.
 */
export async function castVote(proposalId: number, support: boolean, options: any = {}) {
  await netId(this);

  const errorPrefix = 'Compound [castVote] | ';

  if (typeof proposalId !== 'number') {
    throw Error(errorPrefix + 'Argument `proposalId` must be an integer.');
  }

  if (typeof support !== 'boolean') {
    throw Error(errorPrefix + 'Argument `support` must be a boolean.');
  }

  const governorAddress = address[this._network.name].GovernorAlpha;
  const trxOptions: any = options;
  trxOptions._compoundProvider =  this._provider;
  trxOptions.abi =  abi.GovernorAlpha;
  const parameters = [ proposalId, support ];
  const method = 'castVote';

  return eth.trx(governorAddress, method, parameters, trxOptions);
}

/**
 * Submit a vote on a Compound Governance proposal using an EIP-712 signature.
 *
 * @param {string} proposalId The ID of the proposal to vote on. This is an
 *     auto-incrementing integer in the Governor Alpha contract.
 * @param {boolean} support A boolean of true for 'yes' or false for 'no' on the
 *     proposal vote.
 * @param {object} signature An object that contains the v, r, and, s values of
 *     an EIP-712 signature.
 * @param {CallOptions} [options] Options to set for `eth_call`, optional ABI
 *     (as JSON object), and ethers.js method overrides. The ABI can be a string
 *     of the single intended method, an array of many methods, or a JSON object
 *     of the ABI generated by a Solidity compiler.
 *
 * @returns {object} Returns an Ethers.js transaction object of the vote
 *     transaction.
 */
export async function castVoteBySig(
  proposalId: number,
  support: boolean,
  signature: any = {},
  options: any = {}
) {
  await netId(this);

  const errorPrefix = 'Compound [castVoteBySig] | ';

  if (typeof proposalId !== 'number') {
    throw Error(errorPrefix + 'Argument `proposalId` must be an integer.');
  }

  if (typeof support !== 'boolean') {
    throw Error(errorPrefix + 'Argument `support` must be a boolean.');
  }

  if (
    !Object.isExtensible(signature) ||
    !signature.v ||
    !signature.r ||
    !signature.s
  ) {
    throw Error(errorPrefix + 'Argument `signature` must be an object that ' + 
      'contains the v, r, and s pieces of an EIP-712 signature.');
  }

  const governorAddress = address[this._network.name].GovernorAlpha;
  const trxOptions: any = options;
  trxOptions._compoundProvider = this._provider;
  trxOptions.abi = abi.GovernorAlpha;
  const { v, r, s } = signature;
  const parameters = [ proposalId, support, v, r, s ];
  const method = 'castVoteBySig';

  return eth.trx(governorAddress, method, parameters, trxOptions);
}
