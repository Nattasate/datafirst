// คอมโพเนนต์หน้าพรีวิวผลลัพธ์สำหรับหน้าดาวน์โหลด - แสดงเฉพาะข้อมูลที่ต้องการ
import React, { useState } from 'react';
import { Download, FileText, Table, CheckCircle, ShoppingCart } from 'lucide-react';

interface ResultsDownloadProps {
  processedData: any;
  downloadUrls?: any;
}

const downloadFormats = [
  {
    id: 'excel',
    name: 'Excel (.xlsx)',
    description: 'Complete analysis with multiple sheets',
    icon: Table,
    recommended: true
  },
  {
    id: 'csv',
    name: 'CSV (.csv)',
    description: 'Association rules in CSV format',
    icon: FileText,
    recommended: false
  }
];

const formatCount = (value: unknown) => {
  if (value === null || value === undefined) {
    return '0';
  }
  const numericValue = typeof value === 'string' ? Number(value) : (value as number);
  if (typeof numericValue === 'number' && Number.isFinite(numericValue)) {
    return numericValue.toLocaleString();
  }
  return String(value);
};

const formatDecimal = (value: unknown, digits: number) => {
  if (value === null || value === undefined) {
    return '-';
  }
  const numericValue = typeof value === 'string' ? Number(value) : (value as number);
  if (typeof numericValue === 'number' && Number.isFinite(numericValue)) {
    return numericValue.toFixed(digits);
  }
  return String(value);
};

const ResultsDownload: React.FC<ResultsDownloadProps> = ({ processedData, downloadUrls }) => {
  const results = processedData?.results;

  const [selectedFormat, setSelectedFormat] = useState<string>('excel');
  const selectedFormatData =
    downloadFormats.find((format) => format.id === selectedFormat) ?? downloadFormats[0];

  const handleDownload = (format: string) => {
    if (!downloadUrls || !downloadUrls[format]) {
      alert('ไฟล์รูปแบบนี้ไม่พร้อมใช้งาน');
      return;
    }

    const link = document.createElement('a');
    link.href = `http://localhost:5000/api/download/${format}/${downloadUrls[format]}`;
    link.download = downloadUrls[format];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!results || !results.success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white border border-red-100 text-center rounded-2xl shadow-sm p-10">
          <p className="text-lg font-semibold text-red-600">ไม่สามารถแสดงผลลัพธ์ได้</p>
          {results?.error && (
            <p className="text-sm text-red-500 mt-2">{results.error}</p>
          )}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Association Rules',
      helper: 'จำนวนกฎที่ค้นพบ',
      value: formatCount(results.totalRules ?? 0),
      wrapper: 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Transactions',
      helper: 'จำนวนธุรกรรมทั้งหมด',
      value: formatCount(results.totalTransactions ?? 0),
      wrapper: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Unique Items',
      helper: 'จำนวนสินค้าที่ต่างกัน',
      value: formatCount(results.totalItems ?? 0),
      wrapper: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100',
      textColor: 'text-orange-600'
    },
    {
      label: 'Frequent Itemsets',
      helper: 'ชุดสินค้าที่พบบ่อย',
      value: formatCount(results.totalFrequentItemsets ?? 0),
      wrapper: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  const topRules = Array.isArray(results.rulesTable)
    ? results.rulesTable.slice(0, 15)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white text-emerald-600 shadow-sm">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">ผลลัพธ์การวิเคราะห์ Basket Analysis</p>
              <h2 className="text-xl font-semibold text-gray-900">Market Basket Analysis Results</h2>
              <p className="text-xs text-gray-500 mt-1">
                แสดงข้อมูลสรุปจากการวิเคราะห์และกฎความสัมพันธ์ที่สำคัญ
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-xl border ${metric.wrapper} p-4 shadow-sm`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {metric.label}
                </p>
                <p className={`mt-2 text-2xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{metric.helper}</p>
              </div>
            ))}
          </div>

          {topRules.length > 0 ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Top Association Rules</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Analysis Method: {results.analysis?.method || 'mlxtend_apriori'}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Rank</th>
                      <th className="px-4 py-3 text-left font-semibold">If Customer Buys</th>
                      <th className="px-4 py-3 text-left font-semibold">Then Also Buys</th>
                      <th className="px-4 py-3 text-left font-semibold">Support</th>
                      <th className="px-4 py-3 text-left font-semibold">Confidence</th>
                      <th className="px-4 py-3 text-left font-semibold">Lift</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topRules.map((rule: any, index: number) => {
                      const rank = rule.Rank ?? index + 1;
                      const antecedent = rule.If_Customer_Buys ?? rule.Antecedents;
                      const consequent = rule.Then_Also_Buys ?? rule.Consequents;
                      const support = rule.Support ?? rule.support;
                      const confidence = rule.Confidence ?? rule.confidence;
                      const lift = rule.Lift ?? rule.lift;

                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-medium text-gray-800">{rank}</td>
                          <td className="px-4 py-3 font-semibold text-blue-700">
                            {antecedent}
                          </td>
                          <td className="px-4 py-3 font-semibold text-emerald-700">
                            {consequent}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatDecimal(support, 4)}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatDecimal(confidence, 3)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-orange-600">
                            {formatDecimal(lift, 3)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-600">ยังไม่พบกฎความสัมพันธ์สำหรับการแสดงผล</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
          พบกฎความสัมพันธ์ทั้งหมด {formatCount(results.totalRules ?? topRules.length)} กฎ จากธุรกรรม {formatCount(results.totalTransactions ?? 0)} รายการ และสินค้าทั้งหมด {formatCount(results.totalItems ?? 0)} รายการ
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">📥 Download Your Results</h3>
          <p className="text-gray-600 text-sm mt-2">
            เลือกรูปแบบไฟล์ที่ต้องการดาวน์โหลด - ไฟล์พร้อมใช้งานทันที
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloadFormats.map((format) => {
              const FormatIcon = format.icon;
              const isAvailable = Boolean(downloadUrls && downloadUrls[format.id]);

              return (
                <div
                  key={format.id}
                  className={`relative p-4 rounded-lg border transition-all duration-200 ${
                    selectedFormat === format.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : isAvailable
                      ? 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-25'
                      : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => isAvailable && setSelectedFormat(format.id)}
                >
                  <div className="text-center space-y-1">
                    <FormatIcon
                      className={`h-6 w-6 mx-auto ${
                        selectedFormat === format.id ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    />
                    <h4 className="font-semibold text-gray-900 text-sm">{format.name}</h4>
                    <p className="text-xs text-gray-600">{format.description}</p>
                    {format.recommended && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                        แนะนำ
                      </span>
                    )}
                    {!isAvailable && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2">
                        ไม่พร้อม
                      </span>
                    )}
                  </div>
                  {selectedFormat === format.id && isAvailable && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <h4 className="font-semibold text-gray-900">📋 ไฟล์ที่จะดาวน์โหลด:</h4>
              {selectedFormat === 'excel' ? (
                <div className="space-y-1">
                  <p>• รายงานครบถ้วนหลาย sheets: Summary, Association Rules, Single Rules, Frequent Itemsets</p>
                  <p>• พร้อมใช้งานใน Microsoft Excel หรือ Google Sheets</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p>• Association Rules ในรูปแบบ CSV</p>
                  <p>• เปิดได้ใน Excel, Google Sheets, หรือโปรแกรมอื่นๆ</p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleDownload(selectedFormat)}
              disabled={!downloadUrls || !downloadUrls[selectedFormat]}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 mx-auto text-lg ${
                downloadUrls && downloadUrls[selectedFormat]
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-6 w-6" />
              <span>ดาวน์โหลด {selectedFormatData?.name}</span>
            </button>

            <p className="text-sm text-gray-500">🛒 Market Basket Analysis Results - พร้อมใช้งานทันที</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ResultsDownload;
