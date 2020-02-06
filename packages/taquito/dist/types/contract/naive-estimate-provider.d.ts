import { DEFAULT_FEE, DEFAULT_GAS_LIMIT } from '../constants';
import { OriginateParams, TransferParams } from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from './interface';
/**
 * @description Naïve implementation of an estimate provider. Will work for basic transaction but your operation risk to fail if they are more complex (smart contract interaction)
 */
export declare class NaiveEstimateProvider implements EstimationProvider {
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for an origination operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param OriginationOperation Originate operation parameter
     */
    originate({ fee, storageLimit, gasLimit, }: OriginateParams): Promise<Estimate>;
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for an transfer operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param TransferOperation Originate operation parameter
     */
    transfer({ fee, storageLimit, gasLimit, }: TransferParams): Promise<Estimate>;
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for a delegate operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param Estimate
     */
    setDelegate({ fee, gasLimit, }: {
        fee?: DEFAULT_FEE | undefined;
        gasLimit?: DEFAULT_GAS_LIMIT | undefined;
    }): Promise<Estimate>;
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for a delegate operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param Estimate
     */
    registerDelegate({ fee, gasLimit, }: {
        fee?: DEFAULT_FEE | undefined;
        gasLimit?: DEFAULT_GAS_LIMIT | undefined;
    }): Promise<Estimate>;
}