import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';


export default function CardList({ evaluations }) {
  return (
    <List disablePadding>
      {evaluations.map((evaluation, i) => (
        <ListItem key={i} disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <Card sx={{minWidth: 1}}>
              <CardContent>
                <Typography variant="h6">{evaluation.beans}</Typography>
                <Typography>温度：{evaluation.temperature} ℃</Typography>
                <Typography>味わい：{evaluation.taste}</Typography>
                <Typography>濃さ：{evaluation.strength}</Typography>
              </CardContent>
            </Card>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
