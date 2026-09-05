import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

// Esta descrição representa uma tabela existente; ela não altera o banco sozinha.
export const tarefas = pgTable("tarefas", {
  id: serial("id").primaryKey(),
  descricao: text("descricao").notNull(),
  concluido: boolean("concluido").notNull().default(false),
  projetoId: integer("projeto_id"),
});
