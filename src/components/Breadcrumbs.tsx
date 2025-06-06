import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs() {
  const { t } = useTranslation();
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
          name = t('nav.batteries');
          break;
        case 'devices':
          name = t('nav.devices');
          break;
        case 'new':
          name = t('nav.new');
          break;
        case 'select-battery':
          name = t('nav.selectBattery');
          break;
        default:
          // デバイスIDまたは電池IDの場合（16進数のような文字列）
          if (curr.length >= 2 && !isNaN(Number('0x' + curr.substring(0, 2)))) {
            // 前のパスセグメントがdevicesの場合はデバイス詳細
            if (idx > 0 && pathSegments[idx - 1] === 'devices') {
              name = t('nav.detail');
            }
            // 前のパスセグメントがbatteriesの場合は電池詳細
            else if (idx > 0 && pathSegments[idx - 1] === 'batteries') {
              name = t('nav.detail');
            }
          }
      }

      items.push({ name, href: path });
      return path;
    }, '');

    setBreadcrumbs(items);
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Link
            to={item.href}
            className={`hover:text-gray-700 dark:hover:text-gray-300 ${index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-dark-text font-medium' : ''
              }`}
          >
            {item.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
