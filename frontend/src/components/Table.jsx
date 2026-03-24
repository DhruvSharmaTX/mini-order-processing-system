export default function Table({ columns, data, renderActions, loading }) {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col.header}</th>
                        ))}
                        {renderActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + 1}>
                                <div className="table-loading">
                                    Loading...
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1}>
                                <div className="table-empty">
                                    No data found 😕
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index}>
                                {columns.map((col, i) => {
                                    const value = col.render
                                        ? col.render(item)
                                        : item[col.accessor];

                                    if (col.accessor === "status") {
                                        return (
                                            <td key={i}>
                                                <span className={`badge ${value?.toLowerCase()}`}>
                                                    {value}
                                                </span>
                                            </td>
                                        );
                                    }

                                    return <td key={i}>{value}</td>;
                                })}
                                {renderActions && (
                                    <td>
                                        <div className="action-buttons">
                                            {renderActions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}