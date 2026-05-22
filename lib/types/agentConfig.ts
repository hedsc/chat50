export interface FAQ {
  pergunta: string;
  resposta: string;
}

export interface DadosFormulario {
  // Passo 1
  nomeNegocio: string;
  sector: string;
  descricao: string;
  diasFuncionamento: string[];
  horarioAbertura: string;
  horarioFecho: string;

  // Passo 2
  nomeAgente: string;
  tom: "formal" | "simpatico" | "neutro";
  mensagemBoasVindas: string;

  // Passo 3
  faqs: FAQ[];
  catalogo: string;

  // Passo 4
  keywordsEscalamento: string[];
  emailDono: string;
  telefoneDono: string;
}

export const dadosIniciais: DadosFormulario = {
  nomeNegocio: "",
  sector: "",
  descricao: "",
  diasFuncionamento: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
  horarioAbertura: "09:00",
  horarioFecho: "18:00",
  nomeAgente: "",
  tom: "neutro",
  mensagemBoasVindas: "",
  faqs: Array.from({ length: 10 }, () => ({ pergunta: "", resposta: "" })),
  catalogo: "",
  keywordsEscalamento: [],
  emailDono: "",
  telefoneDono: "",
};

export const SECTORES = [
  "Restauração e Alimentação",
  "Retalho e Comércio",
  "Saúde e Bem-estar",
  "Educação e Formação",
  "Tecnologia e Software",
  "Serviços Profissionais",
  "Turismo e Hotelaria",
  "Beleza e Estética",
  "Imobiliário",
  "Outro",
];

export const DIAS_SEMANA = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export const HORAS = Array.from({ length: 36 }, (_, i) => {
  const totalMin = 360 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});
