package com.expensemanagement.services;

import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import java.util.List;

public interface TeamService {
    Team createTeam(String teamName, Long managerId);

    Team assignManager(Long teamId, Long managerId);

    Team addMember(Long teamId, Long userId);

    Team removeMember(Long teamId, Long userId);

    List<Team> getAllTeams();

    Team getTeamByManager(User manager);

    List<User> getTeamMembers(Team team);

    Long getTeamCount();
}
