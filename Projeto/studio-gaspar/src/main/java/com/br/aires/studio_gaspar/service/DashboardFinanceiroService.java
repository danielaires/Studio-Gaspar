package com.br.aires.studio_gaspar.service;

import com.br.aires.studio_gaspar.dto.DashboardFinanceiroDTO;
import com.br.aires.studio_gaspar.dto.ReceitaMensalDTO;
import com.br.aires.studio_gaspar.repository.MensalidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardFinanceiroService {

    private final MensalidadeRepository repository;

    public DashboardFinanceiroDTO buscarDashboard() {

        Long total = repository.buscarTotalMensalidades();

        Double inadimplencia = 0.0;

        if (total > 0) {

            inadimplencia =
                    (repository.buscarTotalVencidas().doubleValue() * 100)
                            / total.doubleValue();

        }

        return new DashboardFinanceiroDTO(

                repository.buscarTotalRecebido(),

                repository.buscarTotalReceber(),

                repository.buscarTotalPagas(),

                repository.buscarTotalPendentes(),

                repository.buscarTotalVencidas(),

                total,

                Math.round(inadimplencia * 100.0) / 100.0

        );

    }
    public List<ReceitaMensalDTO> buscarReceitaMensal() {

        List<Object[]> resultado = repository.buscarReceitaMensal();

        List<ReceitaMensalDTO> lista = new ArrayList<>();

        String[] meses = {
                "",
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez"
        };

        for (Object[] obj : resultado) {

            Integer mes = ((Number) obj[0]).intValue();

            BigDecimal valor = (BigDecimal) obj[1];

            lista.add(new ReceitaMensalDTO(
                    meses[mes],
                    valor
            ));

        }

        return lista;

    }

}
