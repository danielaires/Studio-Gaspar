package com.br.aires.studio_gaspar.repository;

import com.br.aires.studio_gaspar.entity.Mensalidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MensalidadeRepository extends JpaRepository<Mensalidade,Long> {

    List<Mensalidade> findByStatus(String status);

    List<Mensalidade> findByStatusIn(List<String> status);

    List<Mensalidade> findByVencimento(LocalDate data);

    List<Mensalidade> findByAlunoId(Long id);

    @Query("""
            SELECT COALESCE(SUM(m.valor), 0)
            FROM Mensalidade m
            WHERE m.status = 'PAGO'
            """)
    BigDecimal buscarTotalRecebido();

    @Query("""
            SELECT COALESCE(SUM(m.valor), 0)
            FROM Mensalidade m
            WHERE m.status = 'PENDENTE'
            """)
    BigDecimal buscarTotalReceber();

    @Query("""
            SELECT COUNT(m)
            FROM Mensalidade m
            WHERE m.status = 'PAGO'
            """)
    Long buscarTotalPagas();

    @Query("""
            SELECT COUNT(m)
            FROM Mensalidade m
            WHERE m.status = 'PENDENTE'
            """)
    Long buscarTotalPendentes();

    @Query("""
            SELECT COUNT(m)
            FROM Mensalidade m
            WHERE m.status = 'VENCIDO'
            """)
    Long buscarTotalVencidas();

    @Query("""
            SELECT COUNT(m)
            FROM Mensalidade m
            """)
    Long buscarTotalMensalidades();

    @Query("""
    SELECT MONTH(m.pagamento), COALESCE(SUM(m.valor),0)
    FROM Mensalidade m
    WHERE m.status = 'PAGO'
    GROUP BY MONTH(m.pagamento)
    ORDER BY MONTH(m.pagamento)
            """)
    List<Object[]> buscarReceitaMensal();
}

