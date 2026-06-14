import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead } from "@/data/prismb";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  new: { label: "Новый", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  contacted: { label: "Связались", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  qualified: { label: "Квалифицирован", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  won: { label: "Сделка", cls: "bg-green-50 text-green-700 border-green-200" },
  lost: { label: "Потеря", cls: "bg-red-50 text-red-600 border-red-200" },
};

interface Props {
  leads: Lead[];
}

export function RecentLeadsTable({ leads }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние лиды</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Контакт</TableHead>
              <TableHead>Канал</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Сумма сделки</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const st = STATUS_MAP[lead.status] ?? STATUS_MAP.new;
              return (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">{lead.channel}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${st.cls}`}>
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.date}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {lead.budget.toLocaleString("ru-RU")} ₽
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
