import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MakeAdmin = () => {
    const [emailQuery, setEmailQuery] = useState('');
    const [searchText, setSearchText] = useState('');
    const axiosSecure = useAxiosSecure();

    // Search users by email
    const { data: users = [], refetch, isFetching } = useQuery({
        queryKey: ['searchedUsers', searchText],
        queryFn: async () => {
            if (!searchText) return [];
            const res = await axiosSecure.get(`/users/search?email=${searchText}`);
            return res.data;
        },
        enabled: !!searchText
    });

    // Mutation to update user role
    const { mutate: updateRole, isPending: isUpdating } = useMutation({
        mutationFn: async ({ userId, newRole }) => {
            const res = await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
            return res.data;
        },
        onSuccess: (data, variables) => {
            const { newRole } = variables;
            if (data.result?.modifiedCount > 0) {
                Swal.fire('Success', `Role updated to ${newRole}`, 'success');
                refetch();
            }
        },
        onError: (err) => {
            console.error(err);
            Swal.fire('Error', 'Failed to update role', 'error');
        }
    });
    

    // Handle search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchText(emailQuery.trim());
    };

    // Handle role change with confirmation
    const handleRoleChange = async (user, newRole) => {
        const confirm = await Swal.fire({
            title: `Change Role to ${newRole}?`,
            text: `Are you sure you want to make ${user.email} an ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, make ${newRole}`,
        });

        if (confirm.isConfirmed) {
            updateRole({ userId: user._id, newRole });
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search user by email"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
                <button type="submit" className="btn btn-primary" disabled={!emailQuery.trim()}>
                    Search
                </button>
            </form>

            {/* Results Table */}
            {isFetching ? (
                <p className="text-gray-500">Searching...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-info'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        {/* Make Admin Button */}
                                        {user.role !== 'admin' && (
                                            <button
                                                className="btn btn-xs btn-success"
                                                disabled={isUpdating}
                                                onClick={() => handleRoleChange(user, 'admin')}
                                            >
                                                Make Admin
                                            </button>
                                        )}

                                        {/* Remove Admin Button */}
                                        {user.role === 'admin' && (
                                            <button
                                                className="btn btn-xs btn-warning"
                                                disabled={isUpdating}
                                                onClick={() => handleRoleChange(user, 'user')}
                                            >
                                                Remove Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;
