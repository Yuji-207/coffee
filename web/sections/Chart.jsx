import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';


const format = data => (
  data.map(value => ({
    'propability': value,
  }))
);


export default function Chart({ data, margin, aspect=2.4}) {
  data = format(data);
  return (
    <ResponsiveContainer aspect={aspect}>
      <AreaChart data={data} margin={margin} >
        <defs>
          <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00838f" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00838f" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="propability"
          stroke="#00838f"
          fill="url(#colorP)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
