package com.expensemanagement.services;

import com.expensemanagement.entities.Role;
import com.expensemanagement.entities.Team;
import com.expensemanagement.entities.User;
import com.expensemanagement.exception.UnauthorizedAccessException;
import com.expensemanagement.repository.TeamRepository;
import com.expensemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Team createTeam(String teamName, Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new IllegalArgumentException("User must have MANAGER role to manage a team");
        }

        if (manager.getManagedTeam() != null) {
            throw new IllegalArgumentException("Manager is already managing another team");
        }

        Team team = Team.builder()
                .name(teamName)
                .manager(manager)
                .build();

        return teamRepository.save(team);
    }

    @Override
    @Transactional
    public Team assignManager(Long teamId, Long managerId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new IllegalArgumentException("User must have MANAGER role to manage a team");
        }

        if (manager.getManagedTeam() != null && !manager.getManagedTeam().getId().equals(teamId)) {
            throw new IllegalArgumentException("Manager is already managing another team");
        }

        team.setManager(manager);
        return teamRepository.save(team);
    }

    @Override
    @Transactional
    public Team addMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        member.setTeam(team);
        userRepository.save(member);

        return team;
    }

    @Override
    @Transactional
    public Team removeMember(Long teamId, Long userId) {
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (member.getTeam() != null && member.getTeam().getId().equals(teamId)) {
            member.setTeam(null);
            userRepository.save(member);
        }

        return teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamByManager(User manager) {
        return teamRepository.findByManager(manager)
                .orElseThrow(() -> new UnauthorizedAccessException("Manager does not manage any team"));
    }

    @Override
    public List<User> getTeamMembers(Team team) {
        return userRepository.findByTeam(team);
    }

    @Override
    public Long getTeamCount() {
        return teamRepository.count();
    }
}
