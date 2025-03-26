import { getBlock, pushBlockChildren } from "../client/notes/block";

export const BlockStateManager = {
    getBlock(id) {
        return document.getElementById("block-" + id);
    },

    getWrappedBlock(id) {
        return this.getBlock(id).parentElement.parentElement;
    },

    getPrevBlock(id) {        
        return this.getWrappedBlock(id).previousElementSibling;
    },

    getBlockContainer(id) {
        try {
            return document.getElementById("block-container-" + id).children[0];
        } catch (e) {
            return null;
        }
    },

    getBlockId(el) {
        return el.children[0].children[2].id.slice(6);
    },

    pushBlockChildren(parent_id, child_id) {
        const child = this.getWrappedBlock(child_id);

        const container = this.getBlockContainer(parent_id);

        if (!container) {
            return;
        }

        container.appendChild(child);

        pushBlockChildren(parent_id, child_id);
    },

    raiseBlockPosition(id) {
        const prev = this.getPrevBlock(id);

        if (!prev) {
            return;
        }

        const prev_id = this.getBlockId(prev);

        this.pushBlockChildren(prev_id, id);
    },

    async lowerBlockPosition(id) {
        const block = await getBlock(id);

        const parent = await getBlock(block.parent);
        // const parentParent = await getBlock(parent.parent);

        this.pushBlockChildren(parent.parent, id);
    }
}