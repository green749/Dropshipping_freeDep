import { takeLatest, put, call } from 'redux-saga/effects';
import { financeApi } from '../../api/financeApi';
import {
  fetchProfitSummary,
  fetchProfitTimeline,
  fetchProductProfitability,
  fetchOrderProfitability,
  fetchExpenses,
  fetchExpenseSummary,
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
  setLoading,
  setExpensesLoading,
  setError,
  setProfitSummary,
  setProfitTimeline,
  setProductProfitability,
  setOrderProfitability,
  setExpenses,
  setExpenseSummary,
  expenseCreated,
  expenseUpdated,
  expenseDeleted,
} from '../slices/financeSlice';

function* handleFetchProfitSummary(action: any): Generator<any, void, any> {
  try {
    yield put(setLoading(true));
    const response = yield call(financeApi.getProfitSummary, action.payload);
    yield put(setProfitSummary(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load profit summary';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchProfitTimeline(action: any): Generator<any, void, any> {
  try {
    const response = yield call(financeApi.getProfitTimeline, action.payload);
    yield put(setProfitTimeline(response.data || []));
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load profit timeline';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchProductProfitability(action: any): Generator<any, void, any> {
  try {
    const response = yield call(financeApi.getProductProfitability, action.payload);
    yield put(setProductProfitability(response.data || []));
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load product profitability';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchOrderProfitability(action: any): Generator<any, void, any> {
  try {
    const response = yield call(financeApi.getOrderProfitability, action.payload);
    yield put(setOrderProfitability(response.data || []));
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load order profitability';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchExpenses(action: any): Generator<any, void, any> {
  try {
    yield put(setExpensesLoading(true));
    const response = yield call(financeApi.getExpenses, action.payload);
    yield put(
      setExpenses({
        data: response.data || [],
        pagination: response.pagination,
      })
    );
    action.meta?.resolve?.(response.data || []);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load expenses';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleFetchExpenseSummary(action: any): Generator<any, void, any> {
  try {
    const response = yield call(financeApi.getExpenseSummary, action.payload);
    yield put(setExpenseSummary(response.data));
    action.meta?.resolve?.(response.data);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to load expense summary';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleCreateExpense(action: any): Generator<any, void, any> {
  try {
    yield put(setExpensesLoading(true));
    const response = yield call(financeApi.createExpense, action.payload);
    yield put(expenseCreated(response.data));
    // Refresh profit summary and timeline in background
    yield put(fetchProfitSummary({ business_id: action.payload.business_id }));
    yield put(fetchProfitTimeline({ business_id: action.payload.business_id }));
    action.meta?.resolve?.(response.data || response);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to create expense';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleUpdateExpense(action: any): Generator<any, void, any> {
  try {
    yield put(setExpensesLoading(true));
    const response = yield call(financeApi.updateExpense, action.payload.id, action.payload.data);
    yield put(expenseUpdated(response.data));
    // Refresh summary
    yield put(fetchProfitSummary({ business_id: action.payload.data.business_id }));
    action.meta?.resolve?.(response.data || response);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to update expense';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

function* handleDeleteExpense(action: any): Generator<any, void, any> {
  try {
    yield put(setExpensesLoading(true));
    yield call(financeApi.deleteExpense, action.payload);
    yield put(expenseDeleted(action.payload));
    action.meta?.resolve?.(action.payload);
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || 'Failed to delete expense';
    yield put(setError(msg));
    action.meta?.reject?.(msg);
  }
}

export function* financeSaga() {
  yield takeLatest(fetchProfitSummary.type, handleFetchProfitSummary);
  yield takeLatest(fetchProfitTimeline.type, handleFetchProfitTimeline);
  yield takeLatest(fetchProductProfitability.type, handleFetchProductProfitability);
  yield takeLatest(fetchOrderProfitability.type, handleFetchOrderProfitability);
  yield takeLatest(fetchExpenses.type, handleFetchExpenses);
  yield takeLatest(fetchExpenseSummary.type, handleFetchExpenseSummary);
  yield takeLatest(createExpenseAction.type, handleCreateExpense);
  yield takeLatest(updateExpenseAction.type, handleUpdateExpense);
  yield takeLatest(deleteExpenseAction.type, handleDeleteExpense);
}
