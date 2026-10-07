import { takeLatest, put, call } from 'redux-saga/effects';
import { returnApi } from '../../api/returnApi';
import {
  fetchReturns,
  createReturn,
  updateReturnStatus,
  setLoading,
  setError,
  setReturns,
  returnCreated,
  returnUpdated,
} from '../slices/returnSlice';

function* handleFetchReturns(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(returnApi.getAll, action.payload);
    yield put(setReturns(response.data || []));
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.message || 'Failed to load returns';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleCreateReturn(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(returnApi.create, action.payload);
    yield put(returnCreated(response.data));
    action.meta?.resolve?.(response.data || response);
  } catch (err: any) {
    const msg = err.message || 'Failed to create return';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleUpdateReturnStatus(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(returnApi.updateStatus, action.payload.id, action.payload.status, action.payload.resolution);
    yield put(returnUpdated(response.data));
    action.meta?.resolve?.(response.data || response);
  } catch (err: any) {
    const msg = err.message || 'Failed to update return status';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

export function* returnSaga() {
  yield takeLatest(fetchReturns.type, handleFetchReturns);
  yield takeLatest(createReturn.type, handleCreateReturn);
  yield takeLatest(updateReturnStatus.type, handleUpdateReturnStatus);
}
