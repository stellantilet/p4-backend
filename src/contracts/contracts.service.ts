import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CHAIN_INFO } from '../config/constants';
import CONTRACTS from '../config/contracts';

@Injectable()
export class ContractsService {
  erc721P4Contract: ethers.Contract;
  constructor(private readonly configService: ConfigService) {}

  protected getChainInfo() {
    const chainId: string = this.configService.get('chainId');
    const provider = new ethers.providers.JsonRpcProvider(
      CHAIN_INFO[chainId].rpc,
    );

    return {
      chainId,
      provider,
    };
  }

  getERC721P4Contract() {
    if (this.erc721P4Contract) {
      return this.erc721P4Contract;
    }

    const { chainId, provider } = this.getChainInfo();
    this.erc721P4Contract = new ethers.Contract(
      CONTRACTS.ERC721P4.addresses[chainId],
      CONTRACTS.ERC721P4.abi,
      provider,
    );
    return this.erc721P4Contract;
  }
}
