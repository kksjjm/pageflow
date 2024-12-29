import React, { useState } from 'react';
import { Screen, ComponentInfo, APIInfo } from '../../types/flow';

interface ScreenNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  node: Screen | null;
  onSave: (updatedNode: Screen) => void;
  buttonPosition?: { x: number; y: number };
}

const DEFAULT_METHOD = 'GET' as const;
const DEFAULT_FORMAT = 'JSON' as const;

const ScreenNodeDialog: React.FC<ScreenNodeDialogProps> = ({
  isOpen,
  onClose,
  node,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<Screen & { componentInfo?: ComponentInfo; apiInfo?: APIInfo }>({
    id: '',
    name: '',
    description: '',
    image: '',
    component: '',
    api: '',
    componentInfo: undefined,
    apiInfo: undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [components, setComponents] = useState<{ name: string; props: string; children: string; actions: string }[]>([{ name: '', props: '', children: '', actions: '' }]);
  const [apis, setApis] = useState<{ apiID: string; endpoint: string }[]>([{ apiID: '', endpoint: '' }]);

  React.useEffect(() => {
    if (node) {
      setFormData({
        id: node.id,
        name: node.name || '',
        description: node.description || '',
        image: node.image || '',
        component: node.component || '',
        api: node.api || '',
        componentInfo: node.componentInfo || [],
        apiInfo: node.apiInfo || [],
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

  const handleAddComponent = () => {
    setComponents((prev) => [...prev, { name: '', props: '', children: '', actions: '' }]);
  };

  const handleComponentChange = (index: number, field: keyof typeof components[0]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newComponents = [...components];
    newComponents[index][field] = e.target.value;
    setComponents(newComponents);
  };

  const handleAddAPI = () => {
    setApis((prev) => [...prev, { apiID: '', endpoint: '' }]);
  };

  const handleAPIChange = (index: number, field: keyof typeof apis[0]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApis = [...apis];
    newApis[index][field] = e.target.value;
    setApis(newApis);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNode = {
      ...formData,
      componentInfo: components.map((component) => ({
        id: component.name,
        name: component.name,
        props: component.props,
      })),
      apiInfo: apis.map((api) => ({
        apiID: api.apiID,
        endpoint: api.endpoint,
        method: DEFAULT_METHOD,
        request: {},
        response: {
          format: DEFAULT_FORMAT,
          structure: {},
        },
      })),
    };
    onSave(updatedNode);
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
      <div className="bg-white rounded-lg p-6 w-[425px] max-w-full" style={{ position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%)' }}>
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
            <label className="flex flex-row text-sm font-medium text-gray-700 mb-1">컴포넌트</label>
            {components.map((component, index) => (
              <div key={index} className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  value={component.name}
                  onChange={handleComponentChange(index, 'name')}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Props</label>
                <input
                  type="text"
                  value={component.props}
                  onChange={handleComponentChange(index, 'props')}
                  placeholder="Props"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <input
                  type="text"
                  value={component.children}
                  onChange={handleComponentChange(index, 'children')}
                  placeholder="Children"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                <input
                  type="text"
                  value={component.actions}
                  onChange={handleComponentChange(index, 'actions')}
                  placeholder="Actions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button type="button" onClick={handleAddComponent} className="text-blue-600 hover:underline">+ 추가</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API</label>
            {apis.map((api, index) => (
              <div key={index} className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">API ID</label>
                <input
                  type="text"
                  value={api.apiID}
                  onChange={handleAPIChange(index, 'apiID')}
                  placeholder="API ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
                <input
                  type="text"
                  value={api.endpoint}
                  onChange={handleAPIChange(index, 'endpoint')}
                  placeholder="Endpoint"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button type="button" onClick={handleAddAPI} className="text-blue-600 hover:underline">+ 추가</button>
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