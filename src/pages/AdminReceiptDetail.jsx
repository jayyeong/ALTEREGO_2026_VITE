import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const AdminReceiptDetail = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReceiptDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/receipts/${id}`);
      setReceipt(response.data);
      setLoading(false);
    } catch (err) {
      console.error('주문 상세 정보를 불러오는 중 오류가 발생했습니다:', err);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // 인증 체크
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    fetchReceiptDetail();
  }, [fetchReceiptDetail, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center">주문을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">주문 상세 정보</h1>
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            목록으로
          </Link>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">주문번호:</span> {receipt.id}</p>
              <p><span className="font-medium">주문일시:</span> {new Date(receipt.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p><span className="font-medium">총 주문금액:</span> {Number(receipt.totalAmount).toLocaleString()} ₩</p>
            </div>
          </div>
        </div>

        {/* 입금자 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">입금자 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">입금자명:</span> {receipt.accountHolder}</p>
              <p><span className="font-medium">은행명:</span> {receipt.bankName}</p>
            </div>
            <div>
              <p><span className="font-medium">계좌번호:</span> {receipt.accountNumber}</p>
              <p><span className="font-medium">연락처:</span> {receipt.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* 주문 상품 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">제작자</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">단가</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">수량</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">소계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {receipt.orders && receipt.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3">{order.itemName}</td>
                  <td className="px-4 py-3">{order.creator}</td>
                  <td className="px-4 py-3">{Number(order.price).toLocaleString()} ₩</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">{Number(order.totalPrice).toLocaleString()} ₩</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td colSpan="4" className="px-4 py-3 text-right font-semibold">총 금액:</td>
                <td className="px-4 py-3 font-semibold">
                  {Number(receipt.totalAmount).toLocaleString()} ₩
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReceiptDetail;