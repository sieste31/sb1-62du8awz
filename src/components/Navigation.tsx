import { useState } from 'react';
import { Battery, Smartphone, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRoot = pathname === '/';
  const activeTab = isRoot || pathname.startsWith('/batteries') ? 'batteries' : 'devices';

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
          </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/batteries"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'batteries'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Battery className="mr-2 h-5 w-5" />
                {t('nav.batteries')}
              </Link>
              <Link
                to="/devices"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'devices'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                {t('nav.devices')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/batteries"
            className={`${
              activeTab === 'batteries'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Battery className="mr-2 h-5 w-5" />
              {t('nav.batteries')}
            </div>
          </Link>
          <Link
            to="/devices"
            className={`${
              activeTab === 'devices'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              {t('nav.devices')}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
