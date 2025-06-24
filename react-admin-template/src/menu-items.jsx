import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  ExitToAppOutlinedIcon: ExitToAppOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'dashboard-group',
      title: 'Dashboard',
      caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'management-group',
      title: 'Manajemen',
      caption: 'Manajemen',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'user-management',
          title: 'Manajemen Pengguna',
          type: 'item',
          url: '/user-management',
          icon: icons['AccountTreeOutlinedIcon']
        },
        {
          id: 'customer-management',
          title: 'Manajemen Pelanggan',
          type: 'item',
          url: '/customer-management',
          icon: icons['AccountTreeOutlinedIcon']
        },
        {
          id: 'product-management',
          title: 'Manajemen Stok Barang',
          type: 'item',
          url: '/product-management',
          icon: icons['AccountTreeOutlinedIcon']
        }
      ]
    },
    {
      id: 'transaction-group',
      title: 'Transaksi',
      caption: 'Transaksi',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'sales-transaction',
          title: 'Transaksi Penjualan',
          type: 'item',
          url: '/sales-transaction',
          icon: icons['AccountTreeOutlinedIcon']
        },
        {
          id: 'receiving-transaction',
          title: 'Transaksi Penerimaan Barang',
          type: 'item',
          url: '/receiving-transaction',
          icon: icons['AccountTreeOutlinedIcon']
        }
      ]
    },
    {
      id: 'reports-group',
      title: 'Laporan',
      caption: 'Laporan',
      type: 'group',
      icon: icons['ChromeReaderModeOutlinedIcon'],
      children: [
        {
          id: 'reports',
          title: 'Laporan',
          type: 'item',
          url: '/reports',
          icon: icons['ChromeReaderModeOutlinedIcon']
        }
      ]
    },
    {
      id: 'customer-menu-tablet',
      title: 'Aplikasi Pelanggan',
      type: 'item',
      icon: icons['AppsOutlinedIcon'],
      url: '/customer-menu-tablet'
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      icon: icons['ExitToAppOutlinedIcon'],
      url: '/logout'
    }
  ]
};
