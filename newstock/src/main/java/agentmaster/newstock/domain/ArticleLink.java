package agentmaster.newstock.domain;

import agentmaster.newstock.domain.Article;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "\"Article_link\"")
@Getter @Setter
public class ArticleLink {

    // 현재 DB는 H2를 이용하기에 AUTO(디폴트 값)을 이용중 추후 POSTGRE를 이용시 다음과 같이 수정
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "article_link_id")
    private Long id;


    @OneToOne (mappedBy = "articleLink", fetch = FetchType.LAZY)
    private Article article;

    private String link;

}
