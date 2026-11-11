export type Perfil = 'ADMIN' | 'INSTRUTOR' | 'ALUNO';
export interface Usuario { id:number; nome:string; email:string; perfil:Perfil; }
export interface Plano { id:number; nome:string; descricao?:string; valor:string|number; duracaoMeses:number; ativo:boolean; }
export interface Aluno { id:number; usuario:{id:number;nome:string;email:string}; plano?:Plano|null; telefone?:string; status:string; }
export interface Treino { id:number; nome:string; descricao?:string; aluno?:{usuario:{nome:string}}; instrutor?:{usuario:{nome:string}}|null; }
export interface Frequencia { id:number; presente:boolean; horario:string; aluno:{usuario:{nome:string}}; }
export interface Pagamento { id:number; valor:string|number; vencimento:string; status:string; aluno:{usuario:{nome:string}}; plano?:Plano|null; }
