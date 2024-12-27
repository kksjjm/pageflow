import React, { useState } from 'react';
import { Screen } from '../../types/flow';

interface ScreenNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  node: Screen | null;
  onSave: (updatedNode: Screen) => void;
  buttonPosition?: { x: number; y: number };
}

const ScreenNodeDialog: React.FC<ScreenNodeDialogProps> = ({
  isOpen,
  onClose,
  node,
  onSave,
  buttonPosition,
}) => {
  const [formData, setFormData] = React.useState<Screen>({
    id: '',
    name: '',
    description: '',
    image: '',
    component: '',
    api: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (node) {
      setFormData({
        id: node.id,
        name: node.name || '',
        description: node.description || '',
        image: node.image || '',
        component: node.component || '',
        api: node.api || '',
      });
      setImagePreview(node.image || null);
    }
  }, [node]);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' })); // 이미지 필드 초기화
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Screen) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[425px] max-w-full" style={{ position: 'absolute', right: '300px', top: '50%', transform: 'translateY(-50%)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">화면 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 업로드</label>
            <div
              className="border border-dashed border-gray-400 p-4 text-center bg-gray-100 hover:bg-gray-200 transition duration-200"
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="미리보기" className="w-full h-auto" />
              ) : (
                <p className="text-gray-600">이미지를 여기에 드래그 앤 드롭하세요.</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={handleImageDelete}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                이미지 삭제
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">컴포넌트</label>
            <input
              type="text"
              value={formData.component}
              onChange={handleChange('component')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API</label>
            <input
              type="text"
              value={formData.api}
              onChange={handleChange('api')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">취소</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScreenNodeDialog;