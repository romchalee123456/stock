import React, { useState, useEffect } from 'react';
import { Search, Printer, Save, Trash2, Plus, ArrowLeft, Calendar } from 'lucide-react';
import type { Product, CartItem, OrderHistory } from '../types';
import axios from 'axios';

function RequisitionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [requisitionDate, setRequisitionDate] = useState(new Date().toISOString().split('T')[0]);
  const [documentNumber, setDocumentNumber] = useState(4);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const transformedProducts = response.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.title,
          image: item.image,
          price: item.price,
          quantity: 10
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    if (orderQuantity > product.quantity) {
      alert('จำนวนสินค้าไม่เพียงพอ');
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, orderQuantity: item.orderQuantity + orderQuantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, orderQuantity }]);
    }

    setProducts(products.map(p => 
      p.id === product.id 
        ? { ...p, quantity: p.quantity - orderQuantity }
        : p
    ));

    setSelectedProduct('');
    setOrderQuantity(1);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ใบเบิกสินค้า</title>
          <style>
            body { font-family: 'Sarabun', sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ใบเบิกสินค้า</h2>
            <p>วันที่เบิก: ${new Date(requisitionDate).toLocaleDateString('th-TH')}</p>
            <p>เลขที่เอกสาร: IB-${documentNumber.toString().padStart(6, '0')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>รายการ</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>รวมเงิน</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.orderQuantity}</td>
                  <td>${(item.price * item.orderQuantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>รวมทั้งสิ้น: ${cartItems.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0).toFixed(2)} บาท</p>
          </div>
          <button onclick="window.print()">พิมพ์เอกสาร</button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleSave = () => {
    if (cartItems.length === 0) {
      alert('กรุณาเลือกสินค้าก่อนบันทึก');
      return;
    }

    const newOrder: OrderHistory = {
      id: Date.now().toString(),
      date: requisitionDate,
      documentNo: `IB-${documentNumber.toString().padStart(6, '0')}`,
      location: '122',
      personId: '0003',
      personName: 'นายเอกพล โจมา',
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0)
    };

    setOrderHistory([...orderHistory, newOrder]);
    setDocumentNumber(prev => prev + 1);
    alert('บันทึกข้อมูลเรียบร้อย');
    handleClear();
  };

  const handleClear = () => {
    setCartItems([]);
    setSelectedProduct('');
    setOrderQuantity(1);
  };

  const handleNewOrder = () => {
    handleClear();
    setDocumentNumber(prev => prev + 1);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchCode.toLowerCase()) ||
    product.id.includes(searchCode)
  );

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 border-b">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <label className="w-24 text-gray-600">วันที่เบิก:</label>
            <div className="relative flex items-center">
              <input 
                type="date" 
                value={requisitionDate}
                onChange={(e) => setRequisitionDate(e.target.value)}
                className="border p-1 w-32" 
              />
              <Calendar className="w-4 h-4 absolute right-2 pointer-events-none text-gray-500" />
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-600">เลขที่เอกสาร:</label>
            <input 
              type="text" 
              value={`IB-${documentNumber.toString().padStart(6, '0')}`} 
              className="border p-1 w-48" 
              readOnly 
            />
          </div>
          <div className="text-right">
            <button className="px-4 py-1 bg-blue-500 text-white rounded">ค้นหา</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-24 text-gray-600">เบิกไปสถานที่:</label>
            <input type="text" value="122" className="border p-1 w-20" readOnly />
            <select className="border p-1 ml-2 flex-grow">
              <option>บจก.ซีเอเชียน อินเตอร์เนชั่นแนล (ไทยแลนด์)ฯ</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="w-32 text-gray-600">ชื่อบุคคลที่เบิก:</label>
            <input type="text" value="0003" className="border p-1 w-20" readOnly />
            <select className="border p-1 ml-2 flex-grow">
              <option>นายเอกพล โจมา</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Search Section */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="w-24 text-gray-600">รหัสรายการ:</label>
            <input 
              type="text" 
              className="border p-1 w-32" 
              placeholder="ค้นหารหัสหรือชื่อ"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <button 
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded flex items-center"
              onClick={() => {
                const product = filteredProducts[0];
                if (product) setSelectedProduct(product.id);
              }}
            >
              <Search className="w-4 h-4 mr-1" />
              ค้นหา
            </button>
          </div>
          <div className="flex items-center">
            <label className="w-24 text-gray-600">ชื่อรายการ:</label>
            <select 
              className="border p-1 flex-grow"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">-- เลือกรายการ --</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name.length > 50 
                    ? product.name.substring(0, 50) + '...' 
                    : product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex items-center">
            <label className="w-24 text-gray-600">หน่วยนับ:</label>
            <input 
              type="text" 
              className="border p-1 w-32" 
              value="ชิ้น"
              readOnly 
            />
          </div>
          <div className="flex items-center">
            <label className="w-24 text-gray-600">ราคา/หน่วย:</label>
            <input 
              type="number" 
              className="border p-1 w-32"
              value={products.find(p => p.id === selectedProduct)?.price || ''}
              readOnly
            />
          </div>
          <div className="flex items-center">
            <label className="w-24 text-gray-600">จำนวนเบิก:</label>
            <input 
              type="number" 
              className="border p-1 w-32"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
              min="1"
            />
            <button 
              className="ml-2 px-4 py-1 bg-green-500 text-white rounded flex items-center"
              onClick={handleAddToCart}
            >
              <Plus className="w-4 h-4 mr-1" />
              เพิ่ม
            </button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="p-4 grid grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className={`border rounded-lg p-2 cursor-pointer ${selectedProduct === product.id ? 'border-blue-500' : ''}`}
            onClick={() => setSelectedProduct(product.id)}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-32 object-contain rounded bg-white"
            />
            <div className="mt-2">
              <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
              <p className="text-sm text-gray-600">คงเหลือ: {product.quantity} ชิ้น</p>
              <p className="text-sm text-gray-600">ราคา: {product.price.toFixed(2)} บาท</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">รหัส</th>
              <th className="border p-2 text-left">รายการ</th>
              <th className="border p-2 text-right">ราคา</th>
              <th className="border p-2 text-right">จำนวน</th>
              <th className="border p-2 text-right">รวมเงิน</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">{item.price.toFixed(2)}</td>
                <td className="border p-2 text-right">{item.orderQuantity}</td>
                <td className="border p-2 text-right">
                  {(item.price * item.orderQuantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-1" />
              พิมพ์
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-1" />
              เก็บข้อมูล
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center"
              onClick={handleClear}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              ลบข้อมูล
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleNewOrder}
            >
              รายการใหม่
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับเมนูหลัก
            </button>
          </div>
          <div className="text-xl font-bold">
            {total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequisitionPage;