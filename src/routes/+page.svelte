<script>
      let sumOfNumbers = '';
      let combinationLength = '';
      let numbersToInclude = Array(6).fill('');
      let excludedNumbers = Array(6).fill('');
      let repeatNumbers = false;
      let maxRepeats = 2;
      let results = [];
      let positionSummary = [];
      let validPositionNumbers = [];

      $: if (combinationLength && !isNaN(parseInt(combinationLength))) {
        validPositionNumbers = Array(parseInt(combinationLength)).fill('');
      }

      function generatePermutations() {
        // Convert inputs to numbers and filter out empty values
        const sum = parseInt(sumOfNumbers);
        const length = parseInt(combinationLength);

        if (sum > 45) {
          alert("Sum of numbers cannot be greater than 45.");
          return;
        }

        if (length > 9) {
          alert("Combination length cannot be greater than 9.");
          return;
        }

        const included = numbersToInclude.map(n => parseInt(n)).filter(n => !isNaN(n));
        const excluded = excludedNumbers.map(n => parseInt(n)).filter(n => !isNaN(n));

        // Modified to handle single digit input without comma separation
        const validPositions = validPositionNumbers.map(pos =>
          pos.split('').map(n => parseInt(n)).filter(n => !isNaN(n))
        );

        // Generate numbers 1-9 excluding the excluded numbers
        const availableNumbers = Array.from({ length: 9 }, (_, i) => i + 1)
          .filter(n => !excluded.includes(n));

        let permutations = [];

        function generate(current, remainingSum, usedCounts = {}) {
          if (current.length === length) {
            if (remainingSum === 0 &&
              included.every(n => current.includes(n)) &&
              current.every((num, pos) =>
                validPositions[pos].length === 0 || validPositions[pos].includes(num)
              )) {
              permutations.push([...current]);
            }
            return;
          }

          const position = current.length;
          const validNumbersForPosition = validPositions[position].length > 0
            ? validPositions[position].filter(n => availableNumbers.includes(n))
            : availableNumbers;

          for (const num of validNumbersForPosition) {
            if (num <= remainingSum) {
              const count = usedCounts[num] || 0;
              if (!repeatNumbers && count > 0) continue;
              if (repeatNumbers && count >= maxRepeats) continue;

              current.push(num);
              usedCounts[num] = count + 1;
              generate(current, remainingSum - num, usedCounts);
              current.pop();
              usedCounts[num] = count;
            }
          }
        }

        generate([], sum);
        results = permutations.sort((a, b) => {
          for (let i = 0; i < length; i++) {
            if (a[i] !== b[i]) return a[i] - b[i];
          }
          return 0;
        });

        // Generate position summary
        positionSummary = Array(length).fill().map((_, position) => {
          const numbersInPosition = new Set(results.map(result => result[position]));
          return Array.from(numbersInPosition).sort((a, b) => a - b);
        });
      }

      $: commonNumbers = results.length > 0 ? findCommonNumbers(results) : [];

      function findCommonNumbers(results) {
        if (results.length === 0) return [];
        let common = results[0];
        for (let i = 1; i < results.length; i++) {
          common = common.filter(number => results[i].includes(number));
        }
        return common;
      }

      function isNumberRemoved(number, position) {
        if (!validPositionNumbers[position]) return false;
        const validNumbers = validPositionNumbers[position]
          .split('') // Modified to split by character instead of comma
          .map(n => parseInt(n))
          .filter(n => !isNaN(n));
        return !validNumbers.includes(number);
      }
    </script>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 class="text-3xl font-bold text-primary text-center mb-8">Killer Sudoku Helper</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <label class="block">
              <span class="section-title">Sum of Numbers*</span>
              <input type="number" bind:value={sumOfNumbers} class="input-field" pattern="[0-9]*" required />
            </label>

            <label class="block">
              <span class="section-title">Combination Length*</span>
              <input type="number" bind:value={combinationLength} class="input-field" pattern="[0-9]*" required />
            </label>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="section-title">Numbers to be Included</h3>
              <div class="grid grid-cols-3 gap-2">
                {#each numbersToInclude as _, i}
                  <input
                    type="number"
                    bind:value={numbersToInclude[i]}
                    class="input-field"
                    placeholder={`Number ${i + 1}`}
                    pattern="[0-9]*"
                  />
                {/each}
              </div>
            </div>

            <div>
              <h3 class="section-title">Excluded Numbers</h3>
              <div class="grid grid-cols-3 gap-2">
                {#each excludedNumbers as _, i}
                  <input
                    type="number"
                    bind:value={excludedNumbers[i]}
                    class="input-field"
                    placeholder={`Number ${i + 1}`}
                    pattern="[0-9]*"
                  />
                {/each}
              </div>
            </div>
          </div>
        </div>

        {#if combinationLength && !isNaN(parseInt(combinationLength))}
          <div>
            <h3 class="section-title">Valid Numbers for Each Position</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              {#each validPositionNumbers as _, i}
                <label class="block">
                  <span class="text-sm font-medium text-gray-600">Position {i + 1}</span>
                  <input
                    type="text"
                    bind:value={validPositionNumbers[i]}
                    class="input-field"
                    placeholder="Enter valid numbers"
                    pattern="[0-9]*"
                    title="Enter numbers without separators"
                  />
                </label>
              {/each}
            </div>
            <p class="text-sm text-gray-500 mt-2">Enter numbers without separators (e.g., "123")</p>
          </div>
        {/if}

        <div class="space-y-4">
          <label class="flex items-center space-x-2">
            <input type="checkbox" bind:checked={repeatNumbers} class="form-checkbox h-5 w-5 text-blue-600" />
            <span>Repeat Numbers</span>
          </label>

          {#if repeatNumbers}
            <label class="block">
              <span class="section-title">Maximum number repeats allowed</span>
              <input type="number" bind:value={maxRepeats} class="input-field" min="1" />
            </label>
          {/if}
        </div>

        <button class="btn-primary w-full" on:click={generatePermutations}>
          Show Permutations
        </button>

        {#if results.length > 0}
          <div class="mt-6 space-y-6">
            {#if commonNumbers.length > 0}
              <div>
                <h3 class="section-title">Numbers Present In All Combinations</h3>
                <div class="flex flex-wrap gap-2">
                  {#each commonNumbers as number}
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded">{number}</span>
                  {/each}
                </div>
              </div>
            {/if}

            <div>
              <h3 class="section-title">Position Summary</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 gap-3">
                  {#each positionSummary as numbers, position}
                    <div class="flex items-center space-x-2">
                      <span class="font-medium min-w-24">Position {position + 1}:</span>
                      <div class="flex flex-wrap gap-2">
                        {#each numbers as number}
                          <span class="px-2 py-1 rounded">{number}</span>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

            <div>
              <h3 class="section-title">Results ({results.length} combinations found)</h3>
              <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                {#each results as result}
                  <div class="py-1 border-b border-gray-200 last:border-0">
                    {#each result as number, i}
                      <span class:font-bold={commonNumbers.includes(number)}>{number}{i < result.length - 1 ? ', ' : ''}</span>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
