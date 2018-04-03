import BN from 'bn.js';
import { Wei } from 'libs/units';
import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';
import {
  getCurrentTo,
  getCurrentValue,
  getFields,
  getUnit,
  getDataExists,
  getValidGasCost
} from 'selectors/transaction';
import { getInitialState } from '../helpers';
import moment from 'moment';
import 'moment-timezone';

describe('helpers selector', () => {
  const state = getInitialState();
  state.transaction = {
    ...state.transaction,
    meta: {
      ...state.transaction.meta,
      unit: 'ETH'
    },
    fields: {
      to: {
        raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new Buffer([0, 1, 2, 3])
      },
      data: {
        raw: '',
        value: null
      },
      nonce: {
        raw: '0',
        value: new BN('0')
      },
      value: {
        raw: '1000000000',
        value: Wei('1000000000')
      },
      gasLimit: {
        raw: '21000',
        value: Wei('21000')
      },
      gasPrice: {
        raw: '1500',
        value: Wei('1500')
      },
      schedulingToggle: {
        raw: 'false',
        value: false
      },
      timeBounty: {
        raw: '1500',
        value: Wei('1500')
      },
      windowSize: {
        raw: '',
        value: null
      },
      windowStart: {
        raw: '',
        value: null
      },
      scheduleTimestamp: {
        raw: '',
        value: null
      },
      scheduleTimezone: {
        raw: moment.tz.guess(),
        value: moment.tz.guess()
      },
      scheduleType: {
        raw: 'time',
        value: 'time'
      },
      scheduleGasPrice: {
        raw: '1500',
        value: Wei('1500')
      },
      scheduleGasLimit: {
        raw: '21000',
        value: Wei('21000')
      },
      scheduleDeposit: {
        raw: '1000000000',
        value: Wei('1000000000')
      }
    }
  };

  it('should reduce the fields state to its base values', () => {
    const values = {
      data: null,
      gasLimit: Wei('21000'),
      gasPrice: Wei('1500'),
      nonce: new BN('0'),
      to: new Buffer([0, 1, 2, 3]),
      value: Wei('1000000000'),
      schedulingToggle: false,
      timeBounty: Wei('1500'),
      windowSize: null,
      windowStart: null,
      scheduleTimestamp: null,
      scheduleType: 'time',
      scheduleTimezone: moment.tz.guess(),
      scheduleGasPrice: Wei('1500'),
      scheduleGasLimit: Wei('21000'),
      scheduleDeposit: Wei('1000000000')
    };
    expect(reduceToValues(state.transaction.fields)).toEqual(values);
  });

  it('should check isFullTransaction with full transaction arguments', () => {
    const currentTo = getCurrentTo(state);
    const currentValue = getCurrentValue(state);
    const transactionFields = getFields(state);
    const unit = getUnit(state);
    const dataExists = getDataExists(state);
    const validGasCost = getValidGasCost(state);
    const isFullTransaction = isFullTx(
      state,
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(true);
  });

  it('should check isFullTransaction without full transaction arguments', () => {
    const currentTo = { raw: '', value: null };
    const currentValue = getCurrentValue(state);
    const transactionFields = getFields(state);
    const unit = getUnit(state);
    const dataExists = getDataExists(state);
    const validGasCost = getValidGasCost(state);
    const isFullTransaction = isFullTx(
      state,
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(false);
  });
});
