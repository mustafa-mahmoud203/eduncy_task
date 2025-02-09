function getChanges(oldData: Record<string, any>, newData: Record<string, any>) {
    const changes: Record<string, { old: any; new: any }> = {};

    Object.keys(newData).forEach((key) => {
        if (newData[key] !== oldData[key]) {
            changes[key] = {
                old: oldData[key],
                new: newData[key]
            };
        }
    });

    return changes;
}

export default getChanges