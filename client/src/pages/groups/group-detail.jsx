import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetail, searchGroupMembers } from "../../redux/slices/groups-slice";

import "./group.css";
import {
  Box, Typography, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Button
} from "@mui/material";

export default function GroupDetail() {
  const { group_id } = useParams();
  const dispatch = useDispatch();

  const { group, members, loading } = useSelector(
    (state) => state.groupDetail
  );

  useEffect(() => {
    dispatch(fetchGroupDetail(group_id));
    dispatch(searchGroupMembers({ group_id }));
  }, [group_id]);

  if (loading || !group)
    return <Typography>Loading...</Typography>;

  return (
    <Box className="group-detail">
      <Typography variant="h4" mb={2}>
        {group.group_name}
      </Typography>

      <Paper className="group-info">
        <Typography><b>Group ID:</b> {group.group_id}</Typography>
        <Typography><b>Owner:</b> {group.owner_id}</Typography>
        
        {group.group_image && (
          <div className="group-image-container" style={{ marginTop: '10px' }}>
            <Typography variant="subtitle1" component="div">
                <b>Group Image:</b>
            </Typography>
            <img 
                src={group.group_image} 
                alt={`${group.group_name} image`} 
                style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    maxHeight: '200px', 
                    marginTop: '5px',
                    borderRadius: '4px'
                }} 
            />
          </div>
        )}

        <div className="group-buttons">
          <Button
            variant="contained"
            component={Link}
            to={`/group/${group_id}/invite`}
          >
            Invite Member
          </Button>

          <Button
            variant="outlined"
            component={Link}
            to={`/group/${group_id}/invitations`}
          >
            View Invitations
          </Button>
        </div>
      </Paper>

      <Typography variant="h5" mb={2}>Members</Typography>

      <Paper>
        <Table>
          <TableHead className="gdetail-thead">
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Join Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {members.map((m) => (
              <TableRow key={m.user_id}>
                <TableCell>{m.user_id}</TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>{m.joined_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>
    </Box>
  );
}