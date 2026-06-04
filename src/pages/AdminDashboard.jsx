import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import { formatKoreanDateTime } from '../utils/dateFormat';

const EMPTY_SUMMARY = {
  totalCount: 0,
  pendingCount: 0,
  completedCount: 0,
  totalAmount: 0,
};

const AdminDashboard = () => {
  const [receipts, setReceipts]     = useState([]);
  const [items, setItems]           = useState([]);
  const [summary, setSummary]       = useState(EMPTY_SUMMARY);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [resp, itemsResp] = await Promise.all([
          fetch(
          `${API_URL}/api/admin/receipts?page=${page}&size=20`,
          { headers: { Accept: 'application/json' } }
          ),
          fetch(`${API_URL}/api/admin/items`, { headers: { Accept: 'application/json' } }),
        ]);

        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        const receiptContent = Array.isArray(data.content) ? data.content : [];

        setReceipts(receiptContent);
        setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 1);

        if (!itemsResp.ok) throw new Error(itemsResp.statusText);
        const itemsData = await itemsResp.json();
        setItems(Array.isArray(itemsData) ? itemsData.sort((a, b) => a.id - b.id) : []);

        try {
          const summaryResp = await fetch(
            `${API_URL}/api/admin/receipts/summary`,
            { headers: { Accept: 'application/json' } }
          );

          if (!summaryResp.ok) throw new Error(summaryResp.statusText);

          const summaryData = await summaryResp.json();
          setSummary({ ...EMPTY_SUMMARY, ...summaryData });
        } catch {
          setSummary({
            ...EMPTY_SUMMARY,
            totalCount: typeof data.totalElements === 'number' ? data.totalElements : receiptContent.length,
            pendingCount: receiptContent.filter(receipt => receipt.status === 'PENDING_PAYMENT').length,
            completedCount: receiptContent.filter(receipt => receipt.status === 'PAYMENT_COMPLETED').length,
            totalAmount: receiptContent.reduce((sum, receipt) => sum + Number(receipt.totalAmount || 0), 0),
          });
        }
      } catch (err) {
        console.error('fetch error:', err);
        setReceipts([]);
        setItems([]);
        setSummary(EMPTY_SUMMARY);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [API_URL, page, navigate]);

  const handleToggleStatus = async (receiptId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/receipts/${receiptId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('상태 변경에 실패했습니다.');

      const updatedReceipt = await response.json();
      const targetReceipt = receipts.find(receipt => receipt.id === receiptId);
      
      setReceipts(prevReceipts => 
        prevReceipts.map(receipt => 
          receipt.id === receiptId 
            ? { ...receipt, status: updatedReceipt.status, statusDescription: updatedReceipt.statusDescription }
            : receipt
        )
      );

      if (targetReceipt && targetReceipt.status !== updatedReceipt.status) {
        setSummary(prevSummary => ({
          ...prevSummary,
          pendingCount: updatedReceipt.status === 'PENDING_PAYMENT'
            ? prevSummary.pendingCount + 1
            : Math.max(prevSummary.pendingCount - 1, 0),
          completedCount: updatedReceipt.status === 'PAYMENT_COMPLETED'
            ? prevSummary.completedCount + 1
            : Math.max(prevSummary.completedCount - 1, 0),
        }));
      }
    } catch (err) {
      console.error('toggle status error:', err);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReceipt = async (receiptId) => {
    if (!window.confirm('정말로 이 주문을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/receipts/${receiptId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('삭제에 실패했습니다.');
      const deletedReceipt = receipts.find(receipt => receipt.id === receiptId);

      setReceipts(prevReceipts => 
        prevReceipts.filter(receipt => receipt.id !== receiptId)
      );

      if (deletedReceipt) {
        setSummary(prevSummary => ({
          ...prevSummary,
          totalCount: Math.max(prevSummary.totalCount - 1, 0),
          pendingCount: deletedReceipt.status === 'PENDING_PAYMENT'
            ? Math.max(prevSummary.pendingCount - 1, 0)
            : prevSummary.pendingCount,
          completedCount: deletedReceipt.status === 'PAYMENT_COMPLETED'
            ? Math.max(prevSummary.completedCount - 1, 0)
            : prevSummary.completedCount,
          totalAmount: Math.max(Number(prevSummary.totalAmount) - Number(deletedReceipt.totalAmount || 0), 0),
        }));
      }

      alert('주문이 삭제되었습니다.');
    } catch (err) {
      console.error('delete error:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleItemSoldOut = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/items/${itemId}/toggle-sold-out`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('상품 품절 상태 변경에 실패했습니다.');

      const updatedItem = await response.json();
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, soldOut: updatedItem.soldOut } : item
        )
      );
    } catch (err) {
      console.error('toggle item sold out error:', err);
      alert('상품 품절 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/receipts/export?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipts_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('export error:', err);
      alert('엑셀 내보내기 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PAYMENT_COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getToggleButtonStyle = (status) => {
    return status === 'PENDING_PAYMENT' 
      ? 'bg-yellow-500 hover:bg-yellow-600' 
      : 'bg-green-500 hover:bg-green-600';
  };

  const formatCurrency = (value) => `${Number(value || 0).toLocaleString()} ₩`;

  const summaryCards = [
    { label: '전체 주문', value: `${Number(summary.totalCount || 0).toLocaleString()}건`, tone: 'text-gray-900' },
    { label: '입금 대기', value: `${Number(summary.pendingCount || 0).toLocaleString()}건`, tone: 'text-yellow-700' },
    { label: '입금 완료', value: `${Number(summary.completedCount || 0).toLocaleString()}건`, tone: 'text-green-700' },
    { label: '총 주문금액', value: formatCurrency(summary.totalAmount), tone: 'text-indigo-700' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">주문 관리</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            로그아웃
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(card => (
            <div key={card.label} className="bg-white rounded shadow p-5">
              <p className="text-sm text-gray-500 mb-2">{card.label}</p>
              <p className={`text-2xl font-bold ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">엑셀 내보내기</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm mb-1">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              엑셀 다운로드
            </button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">상품 판매 상태</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {items.map(item => (
              <div key={item.id} className="border border-gray-200 rounded p-4">
                <div className="mb-3">
                  <p className="font-medium text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{Number(item.price).toLocaleString()} ₩</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-2 py-1 text-xs rounded border ${
                    item.soldOut
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-green-300 bg-green-50 text-green-700'
                  }`}>
                    {item.soldOut ? '품절' : '판매중'}
                  </span>
                  <button
                    onClick={() => handleToggleItemSoldOut(item.id)}
                    className={`px-3 py-1 text-xs text-white rounded ${
                      item.soldOut
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {item.soldOut ? '판매중 처리' : '품절 처리'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['주문번호','주문일시','상태','입금자명','연락처','총금액','관리'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.length > 0 ? (
                receipts.map(r => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 text-sm">{r.id}</td>
                    <td className="px-6 py-4 text-sm">{formatKoreanDateTime(r.createdAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded border ${getStatusStyle(r.status)}`}>
                        {r.statusDescription}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{r.accountHolder}</td>
                    <td className="px-6 py-4 text-sm">{r.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm">{Number(r.totalAmount).toLocaleString()} ₩</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(r.id)}
                          className={`px-3 py-1 text-xs text-white rounded hover:opacity-80 ${getToggleButtonStyle(r.status)}`}
                          title={r.status === 'PENDING_PAYMENT' ? '입금 완료로 변경' : '입금 대기로 변경'}
                        >
                          {r.status === 'PENDING_PAYMENT' ? '완료' : '대기'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteReceipt(r.id)}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          title="주문 삭제"
                        >
                          삭제
                        </button>
                        
                        <Link 
                          to={`/admin/receipt/${r.id}`} 
                          className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        >
                          상세
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">주문 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <button onClick={() => setPage(p => p - 1)} disabled={page===0} className="px-3 py-1 mx-1 border rounded disabled:opacity-50">이전</button>
            <span className="px-2 py-1">{page+1} / {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page>=totalPages-1} className="px-3 py-1 mx-1 border rounded disabled:opacity-50">다음</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
