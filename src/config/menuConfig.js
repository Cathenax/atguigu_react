//存储左侧导航菜单项数据
import { Link } from 'react-router-dom'
import {
    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    ToolOutlined,
    UserOutlined,
    TeamOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from '@ant-design/icons';

function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  
const items = [
    getItem(<Link to='/home'>Home Page</Link>, '/home', <HomeOutlined />),
    getItem('Product', 'sub1', <AppstoreOutlined />, [
      getItem(<Link to='/category'>Category Management</Link>, '/category', <BarsOutlined /> ),
      getItem(<Link to='/product'>Product Management</Link>, '/product', <ToolOutlined />),
    ]),
    getItem(<Link to='/user'>User Management</Link>, '/user', <UserOutlined />),
    getItem(<Link to='/role'>Role Management</Link>, '/role', <TeamOutlined />),
    getItem('Charts', 'sub2', <AreaChartOutlined />, [
      getItem(<Link to='/charts/bar'>Bar</Link>, '/charts/bar', <BarChartOutlined /> ),
      getItem(<Link to='/charts/line'>Line</Link>, '/charts/line', <LineChartOutlined />),
      getItem(<Link to='/charts/pie'>Pie</Link>, '/charts/pie', <PieChartOutlined />),
    ]),
];

export default items