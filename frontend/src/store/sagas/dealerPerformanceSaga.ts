import { takeLatest, put, call } from 'redux-saga/effects';
import { dealerPerformanceApi } from '../../api/dealerPerformanceApi';
import {
  fetchDealerPerformanceSummary,
  fetchDealerPerformanceList,
  fetchDealerPerformanceDetail,
  fetchDealerComparison,
  updateDealerSlaAction,
  updateDealerStatusAction,
  setLoading,
  setDetailLoading,
  setCompareLoading,
  setMutating,
  setError,
  setSummary,
  setDealers,
  setDetail,
  setComparison,
  mutationSuccess,
} from '../slices/dealerPerformanceSlice';

function* handleFetchSummary(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(dealerPerformanceApi.getSummary, action.payload);
    yield put(setSummary(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load dealer performance summary';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchList(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(dealerPerformanceApi.getList, action.payload);
    yield put(
      setDealers({
        dealers: response.data || [],
        pagination: response.pagination,
      })
    );
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load dealer performance list';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchDetail(action: any): Generator<any, void, any> {
  try {
    yield put(setDetailLoading(true));
    const response = yield call(dealerPerformanceApi.getDetail, action.payload.id, {
      business_id: action.payload.business_id,
      timeframe: action.payload.timeframe,
    });
    yield put(setDetail(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load dealer details';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchComparison(action: any): Generator<any, void, any> {
  try {
    yield put(setCompareLoading(true));
    const response = yield call(dealerPerformanceApi.getComparison, action.payload.dealerIds, {
      business_id: action.payload.business_id,
      timeframe: action.payload.timeframe,
    });
    yield put(setComparison(response.data?.dealers || []));
    action.meta?.resolve?.(response.data?.dealers || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load dealer comparison';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleUpdateSla(action: any): Generator<any, void, any> {
  try {
    yield put(setMutating(true));
    const res = yield call(() => dealerPerformanceApi.updateSla(action.payload.id || '', action.payload.data));
    yield put(mutationSuccess());
    yield put(fetchDealerPerformanceSummary(undefined));
    yield put(fetchDealerPerformanceList(undefined));
    if (action.payload?.id) {
      yield put(fetchDealerPerformanceDetail({ id: action.payload.id }));
    }
    action.meta?.resolve?.(res?.data || true);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to update dealer SLA';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleUpdateStatus(action: any): Generator<any, void, any> {
  try {
    yield put(setMutating(true));
    const res = yield call(() => dealerPerformanceApi.updateStatus(action.payload.id || '', action.payload.status || 'ACTIVE'));
    yield put(mutationSuccess());
    yield put(fetchDealerPerformanceSummary(undefined));
    yield put(fetchDealerPerformanceList(undefined));
    if (action.payload?.id) {
      yield put(fetchDealerPerformanceDetail({ id: action.payload.id }));
    }
    action.meta?.resolve?.(res?.data || true);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to update dealer status';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

export function* dealerPerformanceSaga() {
  yield takeLatest(fetchDealerPerformanceSummary.type, handleFetchSummary);
  yield takeLatest(fetchDealerPerformanceList.type, handleFetchList);
  yield takeLatest(fetchDealerPerformanceDetail.type, handleFetchDetail);
  yield takeLatest(fetchDealerComparison.type, handleFetchComparison);
  yield takeLatest(updateDealerSlaAction.type, handleUpdateSla);
  yield takeLatest(updateDealerStatusAction.type, handleUpdateStatus);
}
