import BN from 'bn.js';
import {
  FieldAction,
  TypeKeys as TK,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapAction,
  ResetAction
} from 'actions/transaction';
import { Reducer } from 'redux';
import { State } from './typings';
import { gasPriceToBase, fromWei } from 'libs/units';
import { resetHOF } from 'reducers/transaction/shared';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import moment from 'moment-timezone';

const INITIAL_STATE: State = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  schedulingToggle: { raw: 'false', value: false },
  windowSize: { raw: '', value: null },
  windowStart: { raw: '', value: null },
  scheduleTimestamp: { raw: '', value: null },
  scheduleTimezone: { raw: moment.tz.guess(), value: moment.tz.guess() },
  gasLimit: { raw: '21000', value: new BN(21000) },
  gasPrice: { raw: '20', value: gasPriceToBase(20) },
  timeBounty: {
    raw: fromWei(EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULT, 'ether'),
    value: EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULT
  },
  scheduleType: {
    raw: EAC_SCHEDULING_CONFIG.DEFAULT_SCHEDULING_METHOD,
    value: EAC_SCHEDULING_CONFIG.DEFAULT_SCHEDULING_METHOD
  },
  scheduleGasLimit: {
    raw: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK.toString(),
    value: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK
  },
  scheduleGasPrice: {
    raw: EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK.toString(),
    value: gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK)
  },
  scheduleDeposit: { raw: '', value: null }
};

const updateField = (key: keyof State): Reducer<State> => (state: State, action: FieldAction) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const tokenToEther = (
  state: State,
  { payload: { decimal: _, ...rest } }: SwapTokenToEtherAction
): State => ({
  ...state,
  ...rest,
  data: INITIAL_STATE.data
});

const etherToToken = (
  state: State,
  { payload: { decimal: _, tokenTo: __, tokenValue: ___, ...rest } }: SwapEtherToTokenAction
): State => ({
  ...state,
  ...rest,
  value: INITIAL_STATE.value
});

const tokenToToken = (
  state: State,
  { payload: { decimal: _, tokenValue: __, ...rest } }: SwapTokenToTokenAction
): State => ({ ...state, ...rest });

const reset = resetHOF('fields', INITIAL_STATE);

export const fields = (
  state: State = INITIAL_STATE,
  action: FieldAction | SwapAction | ResetAction
) => {
  switch (action.type) {
    case TK.TO_FIELD_SET:
      return updateField('to')(state, action);
    case TK.VALUE_FIELD_SET:
      return updateField('value')(state, action);
    case TK.DATA_FIELD_SET:
      return updateField('data')(state, action);
    case TK.GAS_LIMIT_FIELD_SET:
      return updateField('gasLimit')(state, action);
    case TK.NONCE_FIELD_SET:
      return updateField('nonce')(state, action);
    case TK.GAS_PRICE_FIELD_SET:
      return updateField('gasPrice')(state, action);
    case TK.TIME_BOUNTY_FIELD_SET:
      return updateField('timeBounty')(state, action);
    case TK.WINDOW_SIZE_FIELD_SET:
      return updateField('windowSize')(state, action);
    case TK.WINDOW_START_FIELD_SET:
      return updateField('windowStart')(state, action);
    case TK.SCHEDULE_TIMESTAMP_FIELD_SET:
      return updateField('scheduleTimestamp')(state, action);
    case TK.SCHEDULE_TIMEZONE_SET:
      return updateField('scheduleTimezone')(state, action);
    case TK.SCHEDULE_TYPE_SET:
      return updateField('scheduleType')(state, action);
    case TK.SCHEDULING_TOGGLE_SET:
      return updateField('schedulingToggle')(state, action);
    case TK.SCHEDULE_GAS_LIMIT_FIELD_SET:
      return updateField('scheduleGasLimit')(state, action);
    case TK.SCHEDULE_GAS_PRICE_FIELD_SET:
      return updateField('scheduleGasPrice')(state, action);
    case TK.SCHEDULE_DEPOSIT_FIELD_SET:
      return updateField('scheduleDeposit')(state, action);
    case TK.TOKEN_TO_ETHER_SWAP:
      return tokenToEther(state, action);
    case TK.ETHER_TO_TOKEN_SWAP:
      return etherToToken(state, action);
    case TK.TOKEN_TO_TOKEN_SWAP:
      return tokenToToken(state, action);
    case TK.RESET:
      return reset(state, action);
    default:
      return state;
  }
};
