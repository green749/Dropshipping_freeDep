import { takeLatest, put, call } from 'redux-saga/effects';
import { inventoryApi } from '../../api/inventoryApi';
import { fetchProducts } from '../slices/productSlice';
import { fetchDealerDashboard } from '../slices/dashboardSlice';
import {
  fetchInventorySummary,
  fetchInventoryProducts,
  fetchProductInventoryDetail,
  fetchInventoryTransactions,
  fetchInventoryMovementTrend,
  submitStockAdjustment,
  submitStockIn,
  setLoading,
  setDetailLoading,
  setTransactionsLoading,
  setMovementLoading,
  setMutating,
  setError,
  setSummary,
  setProducts,
  setProductDetail,
  setTransactions,
  setMovementTrend,
  mutationSuccess,
} from '../slices/inventorySlice';

function* handleFetchSummary(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(inventoryApi.getSummary, action.payload);
    yield put(setSummary(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load inventory summary';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchProducts(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(inventoryApi.getProducts, action.payload);
    yield put(
      setProducts({
        products: response.data || [],
        pagination: response.pagination,
      })
    );
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load inventory products';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchProductDetail(action: any): Generator<any, void, any> {
  try {
    yield put(setDetailLoading(true));
    const response = yield call(inventoryApi.getProductDetail, action.payload.id, {
      velocityPeriod: action.payload.velocityPeriod,
    });
    yield put(setProductDetail(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load product details';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchTransactions(action: any): Generator<any, void, any> {
  try {
    yield put(setTransactionsLoading(true));
    const response = yield call(inventoryApi.getTransactions, action.payload);
    yield put(
      setTransactions({
        transactions: response.data || [],
        pagination: response.pagination,
      })
    );
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load inventory transactions';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchMovementTrend(action: any): Generator<any, void, any> {
  try {
    yield put(setMovementLoading(true));
    const response = yield call(inventoryApi.getMovementTrend, action.payload);
    yield put(setMovementTrend(response.data || []));
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load movement trend';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleSubmitAdjustment(action: any): Generator<any, void, any> {
  try {
    yield put(setMutating(true));
    const response = yield call(inventoryApi.adjustStock, action.payload);
    yield put(mutationSuccess());
    yield put(fetchInventorySummary(undefined));
    yield put(fetchInventoryProducts(undefined));
    yield put(fetchProducts());
    yield put(fetchDealerDashboard());
    if (action.payload.product_id) {
      yield put(fetchProductInventoryDetail({ id: action.payload.product_id }));
      yield put(fetchInventoryTransactions({ product_id: action.payload.product_id }));
    }
    action.meta?.resolve?.(response?.data || true);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to submit stock adjustment';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleSubmitStockIn(action: any): Generator<any, void, any> {
  try {
    yield put(setMutating(true));
    const response = yield call(inventoryApi.stockIn, action.payload);
    yield put(mutationSuccess());
    yield put(fetchInventorySummary(undefined));
    yield put(fetchInventoryProducts(undefined));
    yield put(fetchProducts());
    yield put(fetchDealerDashboard());
    if (action.payload.product_id) {
      yield put(fetchProductInventoryDetail({ id: action.payload.product_id }));
      yield put(fetchInventoryTransactions({ product_id: action.payload.product_id }));
    }
    action.meta?.resolve?.(response?.data || true);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to submit stock-in';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

export function* inventorySaga() {
  yield takeLatest(fetchInventorySummary.type, handleFetchSummary);
  yield takeLatest(fetchInventoryProducts.type, handleFetchProducts);
  yield takeLatest(fetchProductInventoryDetail.type, handleFetchProductDetail);
  yield takeLatest(fetchInventoryTransactions.type, handleFetchTransactions);
  yield takeLatest(fetchInventoryMovementTrend.type, handleFetchMovementTrend);
  yield takeLatest(submitStockAdjustment.type, handleSubmitAdjustment);
  yield takeLatest(submitStockIn.type, handleSubmitStockIn);
}
