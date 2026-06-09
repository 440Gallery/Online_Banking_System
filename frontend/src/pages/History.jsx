import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, FileDown, Search, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (tx) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text('Secure Bank', 105, 20, null, null, 'center');
    doc.setFontSize(14);
    doc.text('Transaction Receipt', 105, 30, null, null, 'center');
    
    // Details
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${tx._id}`, 20, 50);
    doc.text(`Date & Time: ${format(new Date(tx.createdAt), 'PPpp')}`, 20, 60);
    doc.text(`Type: ${tx.type}`, 20, 70);
    doc.text(`Amount: INR ${tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20, 80);
    doc.text(`Status: ${tx.status}`, 20, 90);
    doc.text(`Description: ${tx.description || 'N/A'}`, 20, 100);
    
    if (tx.type === 'Transfer') {
       if (tx.senderAccount === user.account.accountNumber) {
          doc.text(`Transferred To: ${tx.receiverAccount}`, 20, 110);
       } else {
          doc.text(`Received From: ${tx.senderAccount}`, 20, 110);
       }
    }

    doc.text(`Account Balance after Transaction: INR ${tx.balanceAfterTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20, 130);

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for banking with Secure Bank.', 105, 280, null, null, 'center');

    doc.save(`Receipt_${tx._id}.pdf`);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || tx._id.includes(searchTerm);
    const matchesFilter = filterType === 'All' ? true : tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search description or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-sm cursor-pointer"
            >
              <option value="All">All Transactions</option>
              <option value="Deposit">Deposits</option>
              <option value="Withdrawal">Withdrawals</option>
              <option value="Transfer">Transfers</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No transactions found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium whitespace-nowrap">Transaction</th>
                  <th className="p-4 font-medium whitespace-nowrap hidden sm:table-cell">ID & Date</th>
                  <th className="p-4 font-medium text-right whitespace-nowrap">Amount</th>
                  <th className="p-4 font-medium text-center whitespace-nowrap">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTransactions.map((tx) => {
                  let isPositive = false;
                  if (tx.type === 'Deposit') isPositive = true;
                  if (tx.type === 'Transfer' && tx.receiverAccount === user.account.accountNumber) isPositive = true;
                  
                  return (
                    <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {isPositive ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{tx.type}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[250px]">{tx.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-300">{tx._id.substring(0, 8)}...</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                      </td>
                      <td className="p-4 text-right">
                        <p className={`font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                          {isPositive ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bal: ₹{tx.balanceAfterTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDownloadReceipt(tx)}
                          className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors inline-flex"
                          title="Download Receipt"
                        >
                          <FileDown className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
