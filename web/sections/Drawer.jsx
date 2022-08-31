import { useRouter } from 'next/router';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';

import ArticleIcon from '@mui/icons-material/Article';
import CreateIcon from '@mui/icons-material/Create';
import PublicIcon from '@mui/icons-material/Public';


const menuItems = [
  {
    name: 'レシピの評価',
    icon: <CreateIcon />,
    href: '/evaluations',
  },
  {
    name: 'レシピ',
    icon: <ArticleIcon />,
    href: '/recipes',
  },
  {
    name: 'コーヒー豆',
    icon: <PublicIcon />,
    href: '/evaluations',
  },
];


export default function Drawer({open, setOpen}) {
  const router = useRouter();
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <List>
        {menuItems.map((item, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={() => router.push(item.href)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  )
}
