import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    pathSegments.reduce((acc, curr, idx) => {
      const path = `${acc}/${curr}`;
      let name = curr;

      // パスに応じて表示名を設定
      switch (curr) {
        case 'batteries':
          name = '電池管理';
          break;
        case 'devices':
          name = 'デバイス管理';
          break;
        case 'new':
          name = '新規登録';
          break;
        case 'select-battery':
          name = '電池選択';
          break;
        default:
          if (idx === pathSegments.length - 1 && !isNaN(Number('0x' + curr.substring(0, 2)))) {
            name = '詳細';
          }
      }

      items.push({ name, href: path });
      return path;
    }, '');

    setBreadcrumbs(items);
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-gray-700">
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            to={item.href}
            className={`hover:text-gray-700 ${
              index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
