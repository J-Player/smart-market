export interface PrezunicPromotion {
  CodigoOfertaPDV: string;
  Tipo: 'SO' | 'PR';
  Id: string;
  Nome: string;
  UF: string | null;
  DescricaoProduto: string;
  Ean: string;
  ImagemProduto: string | null;
  ExibirEspeciais: string | null;
  Regras: {
      UnidadeDeMedida: string;
      QuantidadeMaxima: string;
      DataInicial: string;
      DataFinal: string;
      TextoOferta: string;
      PrecoPor: string;
      PercentualDesconto: string | null;
      QuantidadeDisponivel: string;
      QuantidadeLeve: string | null;
      QuantidadePague: string | null;
      DataAtivacao: string | null;
      Adicional: {
          PercentualDesconto: string | null;
          Condicao: string | null;
          __typename: string;
      };
      __typename: string;
  };
  __typename: string;
}
