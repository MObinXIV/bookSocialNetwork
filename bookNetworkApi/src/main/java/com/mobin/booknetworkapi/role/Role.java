package com.mobin.booknetworkapi.role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mobin.booknetworkapi.common.BaseAuditingEntity;
import com.mobin.booknetworkapi.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Role extends BaseAuditingEntity {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(unique = true)
    private String name;
    // establish the relation between user & roles
    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    List<User> users;

}
